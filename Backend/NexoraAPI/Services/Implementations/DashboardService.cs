using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Dashboard;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto?> GetDashboardAsync(int userId)
    {
        // 1. Get the user and their studentId
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        var studentId = user.StudentId;

        // ─── Course Stats ────────────────────────────────────────────────────────
        int totalCourses = 0;
        int completedCourses = 0;
        HashSet<string> enrolledModules = new();   // to exclude from recommendations

        if (studentId.HasValue)
        {
            var allRegistrations = await _context.StudentInfos
                .Where(s => s.IdStudent == studentId.Value)
                .ToListAsync();

            totalCourses = allRegistrations.Count;
            completedCourses = allRegistrations
                .Count(s => !string.IsNullOrEmpty(s.FinalResult)
                            && s.FinalResult != "Withdrawn");

            // Track enrolled modules for exclusion in recommendations
            foreach (var reg in allRegistrations)
                enrolledModules.Add($"{reg.CodeModule}|{reg.CodePresentation}");
        }

        int currentCourses = totalCourses - completedCourses;
        double completionPercentage = totalCourses > 0
            ? Math.Round((double)completedCourses / totalCourses * 100, 1)
            : 0;

        // ─── GPA (average assessment score %) ────────────────────────────────────
        double currentGpa = 0;
        if (studentId.HasValue)
        {
            var scores = await _context.StudentAssessments
                .Where(sa => sa.IdStudent == studentId.Value && sa.Score.HasValue)
                .Select(sa => sa.Score!.Value)
                .ToListAsync();

            currentGpa = scores.Count > 0
                ? Math.Round(scores.Average() / 25.0, 2)  // Convert 0-100 → 0-4.0 scale
                : 0;
        }

        // ─── Unread Notifications ─────────────────────────────────────────────────
        int unreadCount = await _context.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);

        // ─── Skills + Progress + Recommendations ──────────────────────────────────
        var skillDtos = new List<SkillProgressDto>();

        var desiredSkills = await _context.StudentSkills
            .Where(s => s.UserId == userId)
            .ToListAsync();

        foreach (var skill in desiredSkills)
        {
            // Get ALL courses tagged with this skill (any level)
            var taggedCourses = await _context.CourseSkillTags
                .Where(t => t.SkillName.ToLower() == skill.SkillName.ToLower())
                .ToListAsync();

            // Exclude courses the student is already enrolled in
            var recommendedTags = taggedCourses
                .Where(t => !enrolledModules.Contains($"{t.CodeModule}|{t.CodePresentation}"))
                .ToList();

            // Build the VLE engagement lookup for this student
            HashSet<string> engagedCourses = new();
            if (studentId.HasValue && recommendedTags.Any())
            {
                var moduleCodes = recommendedTags.Select(t => t.CodeModule).Distinct().ToList();

                var vleActivity = await _context.StudentVles
                    .Where(sv => sv.IdStudent == studentId.Value
                                 && sv.SumClick > 0
                                 && moduleCodes.Contains(sv.CodeModule!))
                    .Select(sv => $"{sv.CodeModule}|{sv.CodePresentation}")
                    .Distinct()
                    .ToListAsync();

                engagedCourses = vleActivity.ToHashSet();
            }

            // Build recommended course list
            var recommended = recommendedTags
                .Select(t => new RecommendedCourseDto
                {
                    CodeModule = t.CodeModule,
                    CodePresentation = t.CodePresentation,
                    Level = t.Level,
                    IsEngaged = engagedCourses.Contains($"{t.CodeModule}|{t.CodePresentation}")
                })
                .OrderBy(r => r.Level switch
                {
                    "Beginner" => 0,
                    "Intermediate" => 1,
                    "Advanced" => 2,
                    _ => 3
                })
                .ToList();

            // Progress = % of recommended courses where student has VLE activity
            double progress = recommended.Count > 0
                ? Math.Round((double)recommended.Count(r => r.IsEngaged) / recommended.Count * 100, 1)
                : 0;

            skillDtos.Add(new SkillProgressDto
            {
                Id = skill.Id,
                SkillName = skill.SkillName,
                TargetLevel = skill.TargetLevel,
                Progress = progress,
                RecommendedCourses = recommended
            });
        }

        return new DashboardDto
        {
            CurrentGpa = currentGpa,
            TotalCourses = totalCourses,
            CompletedCourses = completedCourses,
            CurrentCourses = currentCourses,
            CompletionPercentage = completionPercentage,
            UnreadNotifications = unreadCount,
            Skills = skillDtos
        };
    }
}
