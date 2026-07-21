using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Dashboard;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;
using System.Security.Claims;

namespace NexoraAPI.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public DashboardService(
    AppDbContext context,
    IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CombinedDashboardDto?> GetCombinedDashboardAsync(int userId)
    {
        // ── 1. Resolve user + studentId ──────────────────────────────────────
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;
        var studentId = user.StudentId ?? user.Id;

        // ── 2. Course stats ──────────────────────────────────────────────────
        var allRegistrations = await _context.StudentInfos
            .Where(s => s.IdStudent == studentId)
            .ToListAsync();

        int totalCourses    = allRegistrations.Count;
        int completedCourses = allRegistrations
            .Count(s => !string.IsNullOrEmpty(s.FinalResult) && s.FinalResult != "Withdrawn");
        int currentCourses  = totalCourses - completedCourses;
        double completionPct = totalCourses > 0
            ? Math.Round((double)completedCourses / totalCourses * 100, 1) : 0;

        HashSet<string> enrolledModules = allRegistrations
            .Select(r => $"{r.CodeModule}|{r.CodePresentation}")
            .ToHashSet();

        // ── 3. Load raw student assessment scores (safe — no deep Include on keyless) ─
        // StudentAssessment is HasNoKey() so we CANNOT use Include().ThenInclude() with
        // collection navigations. Instead we query each table separately and join in memory.
        var rawSubmissions = await _context.StudentAssessments
            .Where(sa => sa.IdStudent == studentId && sa.Score.HasValue)
            .Select(sa => new
            {
                sa.IdAssessment,
                sa.Score,
                sa.DateSubmitted
            })
            .ToListAsync();

        var scores = rawSubmissions.Select(s => s.Score!.Value).ToList();

        double currentGpa   = scores.Count > 0 ? Math.Round(scores.Average() / 25.0, 2) : 0;
        double averageScore = scores.Count > 0 ? Math.Round(scores.Average(), 1) : 0;
        double bestScore    = scores.Count > 0 ? Math.Round(scores.Max(), 1) : 0;

        // ── 4. Load assessments + their course's skill tags (separate queries) ─
        var assessmentIds = rawSubmissions
            .Where(s => s.IdAssessment.HasValue)
            .Select(s => s.IdAssessment!.Value)
            .Distinct()
            .ToList();

        // Map: assessmentId → list of skill names on that course
        var assessmentSkillMap = new Dictionary<int, List<string>>();
        if (assessmentIds.Any())
        {
            var assessmentCourses = await _context.Assessments
                .Where(a => assessmentIds.Contains(a.IdAssessment))
                .Select(a => new { a.IdAssessment, a.CodeModule, a.CodePresentation })
                .ToListAsync();

            foreach (var ac in assessmentCourses)
            {
                var skillNames = await _context.CourseSkillTags
                    .Where(t => t.CodeModule == ac.CodeModule && t.CodePresentation == ac.CodePresentation)
                    .Select(t => t.SkillName)
                    .ToListAsync();

                assessmentSkillMap[ac.IdAssessment] = skillNames;
            }
        }

        // ── 5. Real monthly progress (group by yyyyMM from date_submitted int) ─
        var monthlyGroups = rawSubmissions
            .Where(sa => sa.DateSubmitted.HasValue && sa.DateSubmitted.Value.ToString().Length == 8)
            .GroupBy(sa =>
            {
                var ds = sa.DateSubmitted!.Value.ToString();
                return new { Year = int.Parse(ds[..4]), Month = int.Parse(ds.Substring(4, 2)) };
            })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyAssessmentDto
            {
                Month           = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                Year            = g.Key.Year,
                AverageScore    = Math.Round(g.Average(sa => sa.Score!.Value), 1),
                SubmissionCount = g.Count()
            })
            .ToList();

        // ── 6. Skills enriched with real scores ─────────────────────────────
        var desiredSkills = await _context.StudentSkills
            .Where(s => s.UserId == userId)
            .ToListAsync();

        // ── Fallback: if student added no skills manually, derive them from enrolled courses ──
        if (!desiredSkills.Any())
        {
            var enrolledModulesList = allRegistrations
                .Select(r => new { r.CodeModule, r.CodePresentation })
                .ToList();

            foreach (var course in enrolledModulesList)
            {
                var courseTags = await _context.CourseSkillTags
                    .Where(t => t.CodeModule == course.CodeModule && t.CodePresentation == course.CodePresentation)
                    .ToListAsync();

                foreach (var tag in courseTags)
                {
                    if (!desiredSkills.Any(s => s.SkillName.Equals(tag.SkillName, StringComparison.OrdinalIgnoreCase)))
                    {
                        desiredSkills.Add(new StudentSkill
                        {
                            Id        = 0,
                            UserId    = userId,
                            SkillName = tag.SkillName,
                            TargetLevel = tag.Level ?? "Beginner"
                        });
                    }
                }
            }
        }


        var enrichedSkills = new List<EnrichedSkillDto>();

        foreach (var skill in desiredSkills)
        {
            // Average score from assessments whose course has this skill tag
            var relevantScores = rawSubmissions
                .Where(sa => sa.IdAssessment.HasValue &&
                             assessmentSkillMap.TryGetValue(sa.IdAssessment.Value, out var tags) &&
                             tags.Any(t => t.Equals(skill.SkillName, StringComparison.OrdinalIgnoreCase)))
                .Select(sa => sa.Score!.Value)
                .ToList();

            double avgScoreForSkill = relevantScores.Count > 0
                ? Math.Round(relevantScores.Average(), 1) : 0;

            // Recommended courses: tagged with this skill, not yet enrolled
            var taggedCourses = await _context.CourseSkillTags
                .Where(t => t.SkillName.ToLower() == skill.SkillName.ToLower())
                .ToListAsync();

            var notEnrolledTags = taggedCourses
                .Where(t => !enrolledModules.Contains($"{t.CodeModule}|{t.CodePresentation}"))
                .ToList();

            // VLE engagement for those recommended courses
            HashSet<string> engagedCourses = new();
            if (notEnrolledTags.Any())
            {
                var moduleCodes = notEnrolledTags.Select(t => t.CodeModule).Distinct().ToList();
                var vleKeys = await _context.StudentVles
                    .Where(sv => sv.IdStudent == studentId && sv.SumClick > 0
                                 && moduleCodes.Contains(sv.CodeModule!))
                    .Select(sv => $"{sv.CodeModule}|{sv.CodePresentation}")
                    .Distinct()
                    .ToListAsync();
                engagedCourses = vleKeys.ToHashSet();
            }

            var recommended = notEnrolledTags
                .Select(t => new RecommendedCourseDto
                {
                    CodeModule       = t.CodeModule,
                    CodePresentation = t.CodePresentation,
                    Level            = t.Level,
                    IsEngaged        = engagedCourses.Contains($"{t.CodeModule}|{t.CodePresentation}")
                })
                .OrderBy(r => r.Level switch
                {
                    "Beginner"     => 0,
                    "Intermediate" => 1,
                    "Advanced"     => 2,
                    _              => 3
                })
                .ToList();

            double engagementProgress = recommended.Count > 0
                ? Math.Round((double)recommended.Count(r => r.IsEngaged) / recommended.Count * 100, 1) : 0;

            enrichedSkills.Add(new EnrichedSkillDto
            {
                Id                   = skill.Id,
                SkillName            = skill.SkillName,
                TargetLevel          = skill.TargetLevel ?? "Beginner",
                AverageScoreForSkill = avgScoreForSkill,
                EngagementProgress   = engagementProgress,
                RecommendedCourses   = recommended
            });
        }

        return new CombinedDashboardDto
        {
            CurrentGpa                = currentGpa,
            TotalCourses              = totalCourses,
            CompletedCourses          = completedCourses,
            CurrentCourses            = currentCourses,
            CompletionPercentage      = completionPct,
            TotalAssessmentsSubmitted = rawSubmissions.Count,
            AverageAssessmentScore    = averageScore,
            BestAssessmentScore       = bestScore,
            MonthlyAssessmentProgress = monthlyGroups,
            Skills                    = enrichedSkills
        };
    }

    public async Task<TutorDashboardDto?> GetTutorDashboardAsync()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?
            .User
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var tutorUserId))
            return null;

        var tutor = await _context.Users.FirstOrDefaultAsync(u => u.Id == tutorUserId);

        if (tutor == null)
            return null;

        var tutorCourses = await _context.Courses
            .Include(c => c.CourseSkillTags)
            .Where(c => c.TutorId == tutorUserId)
            .ToListAsync();

        

    var courseStatsList = new List<TutorCourseStatsDto>();

        foreach (var c in tutorCourses)
        {
            // Active enrolled students (not withdrawn)
            var enrolledStudentIds = await _context.StudentInfos
                .Where(s => s.CodeModule == c.CodeModule 
                         && s.CodePresentation == c.CodePresentation 
                         && (s.FinalResult == null || s.FinalResult != "Withdrawn"))
                .Select(s => s.IdStudent)
                .Distinct()
                .ToListAsync();

            int enrolledCount = enrolledStudentIds.Count;

            // Unenrolled students (from StudentRegistration with unregistration date or StudentInfo with "Withdrawn")
            var unenrolledFromRegs = await _context.StudentRegistrations
                .Where(sr => sr.CodeModule == c.CodeModule 
                          && sr.CodePresentation == c.CodePresentation 
                          && sr.DateUnregistration.HasValue 
                          && sr.IdStudent.HasValue)
                .Select(sr => sr.IdStudent!.Value)
                .Distinct()
                .ToListAsync();

            var withdrawnFromInfo = await _context.StudentInfos
                .Where(s => s.CodeModule == c.CodeModule 
                         && s.CodePresentation == c.CodePresentation 
                         && s.FinalResult == "Withdrawn")
                .Select(s => s.IdStudent)
                .Distinct()
                .ToListAsync();

            int unenrolledCount = unenrolledFromRegs.Union(withdrawnFromInfo).Distinct().Count();
            int totalStudents = enrolledCount + unenrolledCount;

            double successPercentage = totalStudents > 0
                ? Math.Round((double)enrolledCount / totalStudents * 100, 1)
                : 0;

            int assessmentCount = await _context.Assessments
                .CountAsync(a => a.CodeModule == c.CodeModule && a.CodePresentation == c.CodePresentation);

            courseStatsList.Add(new TutorCourseStatsDto
            {
                CodeModule = c.CodeModule,
                CodePresentation = c.CodePresentation,
                Name = c.Name,
                Description = c.Description,
                Hours = c.Hours,
                EnrolledCount = enrolledCount,
                UnenrolledCount = unenrolledCount,
                TotalStudentsCount = totalStudents,
                SuccessPercentage = successPercentage,
                AssessmentCount = assessmentCount,
                Skills = c.CourseSkillTags.Select(t => t.SkillName).ToList()
            });
        }

        int totalEnrolled = courseStatsList.Sum(cs => cs.EnrolledCount);
        int totalUnenrolled = courseStatsList.Sum(cs => cs.UnenrolledCount);
        int totalAllStudents = totalEnrolled + totalUnenrolled;
        double overallSuccessPercentage = totalAllStudents > 0
            ? Math.Round((double)totalEnrolled / totalAllStudents * 100, 1)
            : 0;

        return new TutorDashboardDto
        {
            TutorId = tutor.Id,
            TutorName = $"{tutor.FirstName} {tutor.LastName}".Trim(),
            TutorEmail = tutor.Email,
            TotalCourses = courseStatsList.Count,
            TotalEnrolledStudents = totalEnrolled,
            TotalUnenrolledStudents = totalUnenrolled,
            TotalStudents = totalAllStudents,
            OverallSuccessPercentage = overallSuccessPercentage,
            TotalAssessments = courseStatsList.Sum(cs => cs.AssessmentCount),
            Courses = courseStatsList
        };
    }
}
