using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs;
using NexoraAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ensure only authenticated students can view/submit their assessments
    public class AssessmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssessmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Assessments/student
        [HttpGet("student")]
        public async Task<ActionResult<IEnumerable<StudentAssessmentDto>>> GetStudentAssessments()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
                {
                    return Unauthorized(new { success = false, message = "لم يتم التعرف على المستخدم، يرجى تسجيل الدخول مجدداً." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "المستخدم غير موجود." });
                }

                var studentId = user.StudentId ?? user.Id;

                var assessments = await _context.StudentAssessments
                    .Include(sa => sa.IdAssessmentNavigation)
                    .Where(sa => sa.IdStudent == studentId)
                    .Select(sa => new StudentAssessmentDto
                    {
                        AssessmentId = sa.IdAssessment ?? 0,
                        CodeModule = sa.IdAssessmentNavigation != null ? sa.IdAssessmentNavigation.CodeModule : "N/A",
                        AssessmentType = sa.IdAssessmentNavigation != null ? sa.IdAssessmentNavigation.AssessmentType : "N/A",
                        Score = sa.Score,
                        DateSubmitted = sa.DateSubmitted,
                        IsBanked = sa.IsBanked == 1
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = assessments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "حدث خطأ أثناء تحميل بيانات التقييمات", error = ex.Message });
            }
        }

        // GET: api/Assessments/available
        // Gets all assessments for the courses the student is enrolled in.
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<AvailableAssessmentDto>>> GetAvailableAssessments()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
                {
                    return Unauthorized(new { success = false, message = "لم يتم التعرف على المستخدم، يرجى تسجيل الدخول مجدداً." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
                if (user == null) return NotFound(new { success = false, message = "المستخدم غير موجود." });

                var studentId = user.StudentId ?? user.Id;

                // 1. Get the courses the student is enrolled in
                var enrolledCourses = await _context.StudentRegistrations
                    .Where(sr => sr.IdStudent == studentId)
                    .Select(sr => new { sr.CodeModule, sr.CodePresentation })
                    .ToListAsync();

                if (!enrolledCourses.Any())
                {
                    return Ok(new { success = true, data = new List<AvailableAssessmentDto>() });
                }

                // 2. Fetch all assessments belonging to those courses
                var allAssessments = new List<Assessment>();
                foreach (var course in enrolledCourses)
                {
                    var courseAssessments = await _context.Assessments
                        .Where(a => a.CodeModule == course.CodeModule && a.CodePresentation == course.CodePresentation)
                        .ToListAsync();
                    allAssessments.AddRange(courseAssessments);
                }

                // 3. Fetch the student's existing scores to see if they completed them
                var studentScores = await _context.StudentAssessments
                    .Where(sa => sa.IdStudent == studentId)
                    .ToDictionaryAsync(sa => sa.IdAssessment ?? 0, sa => sa.Score);

                // 4. Map them to the DTO
                var result = allAssessments.Select(a => new AvailableAssessmentDto
                {
                    AssessmentId = a.IdAssessment,
                    CodeModule = a.CodeModule,
                    CodePresentation = a.CodePresentation,
                    AssessmentType = a.AssessmentType,
                    Date = a.Date,
                    IsCompleted = studentScores.ContainsKey(a.IdAssessment),
                    Score = studentScores.ContainsKey(a.IdAssessment) ? studentScores[a.IdAssessment] : null
                }).ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "حدث خطأ أثناء تحميل التقييمات المتاحة", error = ex.Message });
            }
        }



        // POST: api/Assessments
        // Create a new blank assessment container (For Tutors/Admins)
        [HttpPost]
        public async Task<ActionResult> CreateAssessment([FromBody] CreateAssessmentDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.CodeModule) || string.IsNullOrWhiteSpace(dto.CodePresentation))
                {
                    return BadRequest(new { success = false, message = "CodeModule and CodePresentation are required." });
                }

                // Verify the Course exists
                var courseExists = await _context.Courses.AnyAsync(c => c.CodeModule == dto.CodeModule && c.CodePresentation == dto.CodePresentation);
                if (!courseExists)
                {
                    return BadRequest(new { success = false, message = $"Course '{dto.CodeModule} / {dto.CodePresentation}' not found. You must assign this assessment to a valid course." });
                }

                var assessment = new Assessment
                {
                    CodeModule = dto.CodeModule,
                    CodePresentation = dto.CodePresentation,
                    AssessmentType = dto.AssessmentType,
                    Date = dto.Date
                };

                _context.Assessments.Add(assessment);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Assessment container created successfully.", assessmentId = assessment.IdAssessment });
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = "Failed to create assessment.", error = ex.Message, detail = inner });
            }
        }

        // GET: api/Assessments/{assessmentId}/questions
        [HttpGet("{assessmentId}/questions")]
        public async Task<ActionResult<IEnumerable<AssessmentQuestionDto>>> GetAssessmentQuestions(int assessmentId)
        {
            var questions = await _context.AssessmentQuestions
                .Include(q => q.Options)
                .Where(q => q.AssessmentId == assessmentId)
                .Select(q => new AssessmentQuestionDto
                {
                    Id = q.Id,
                    AssessmentId = q.AssessmentId,
                    Text = q.Text,
                    QuestionType = q.QuestionType,
                    Points = q.Points,
                    Options = q.Options.Select(o => new QuestionOptionDto
                    {
                        Id = o.Id,
                        Text = o.Text
                    }).ToList() 
                })
                .ToListAsync();

            return Ok(new { success = true, data = questions });
        }

        // POST: api/Assessments/{assessmentId}/questions
        [HttpPost("{assessmentId}/questions")]
        public async Task<ActionResult> AddQuestion(int assessmentId, [FromBody] CreateQuestionDto dto)
        {
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.IdAssessment == assessmentId);
            if (!assessmentExists) return NotFound(new { success = false, message = "Assessment not found." });

            var question = new AssessmentQuestion
            {
                AssessmentId = assessmentId,
                Text = dto.Text,
                QuestionType = dto.QuestionType,
                Points = dto.Points,
                Options = dto.Options.Select(o => new QuestionOption
                {
                    Text = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList()
            };

            _context.AssessmentQuestions.Add(question);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Question added successfully!" });
        }

        // POST: api/Assessments/{assessmentId}/submit-answers
        [HttpPost("{assessmentId}/submit-answers")]
        public async Task<ActionResult> SubmitAnswers(int assessmentId, [FromBody] SubmitAnswersDto submission)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
            {
                return Unauthorized(new { success = false, message = "Unauthorized." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var studentId = user.StudentId ?? user.Id;

            var questions = await _context.AssessmentQuestions
                .Include(q => q.Options)
                .Where(q => q.AssessmentId == assessmentId)
                .ToListAsync();

            if (!questions.Any())
            {
                return BadRequest(new { success = false, message = "This assessment has no questions yet." });
            }

            double totalPossiblePoints = questions.Sum(q => q.Points);
            double studentPoints = 0;

            foreach (var q in questions)
            {
                if (submission.Answers.TryGetValue(q.Id, out int selectedOptionId))
                {
                    var selectedOption = q.Options.FirstOrDefault(o => o.Id == selectedOptionId);
                    if (selectedOption != null && selectedOption.IsCorrect)
                    {
                        studentPoints += q.Points;
                    }
                }
            }

            double finalScore = (studentPoints / totalPossiblePoints) * 100;

            var existingRecord = await _context.StudentAssessments
                .FirstOrDefaultAsync(sa => sa.IdAssessment == assessmentId && sa.IdStudent == studentId);

            if (existingRecord != null)
            {
                existingRecord.Score = finalScore;
                existingRecord.DateSubmitted = int.Parse(DateTime.UtcNow.ToString("yyyyMMdd"));
            }
            else
            {
                _context.StudentAssessments.Add(new StudentAssessment
                {
                    IdStudent = studentId,
                    IdAssessment = assessmentId,
                    Score = finalScore,
                    DateSubmitted = int.Parse(DateTime.UtcNow.ToString("yyyyMMdd")),
                    IsBanked = 0
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { 
                success = true, 
                message = "Answers submitted successfully!",
                score = finalScore,
                totalQuestions = questions.Count,
                correctAnswers = studentPoints 
            });
        }


    }
}
