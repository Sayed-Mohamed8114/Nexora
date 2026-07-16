using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs;
using NexoraAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // حماية الـ Endpoint عشان نعرف مين الطالب من الـ Token
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Analytics/dashboard-charts
        [HttpGet("dashboard-charts")]
        public async Task<ActionResult<AnalyticsDashboardDto>> GetDashboardChartsData()
        {
            try
            {
                // 1. جلب الـ User ID من الـ Token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
                {
                    return Unauthorized(new { success = false, message = "لم يتم التعرف على المستخدم، يرجى تسجيل الدخول مجدداً." });
                }

                // 2. جلب بيانات الـ User عشان نعرف الـ StudentId المرتبط بيه
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId);

                if (user == null)
                {
                    return NotFound(new { success = false, message = "المستخدم غير موجود." });
                }

                // 3. جلب مهارات الطالب الحالي فقط
                var studentSkills = await _context.StudentSkills
                    .Where(s => s.UserId == currentUserId)
                    .ToListAsync();

                var skillsProgress = studentSkills.Select(s => {
                    int percentage = 30; // Beginner كقيمة افتراضية لـ
                    if (s.TargetLevel.Equals("Advanced", StringComparison.OrdinalIgnoreCase)) percentage = 90;
                    else if (s.TargetLevel.Equals("Intermediate", StringComparison.OrdinalIgnoreCase)) percentage = 65;

                    return new SkillProgressDto
                    {
                        SkillName = s.SkillName,
                        Percentage = percentage
                    };
                }).ToList();

                // لو الطالب لسه معندوش مهارات مضافة، بنحط مهارات افتراضية عشان الـ UI متظهرش فاضية
                if (!skillsProgress.Any())
                {
                    skillsProgress = new List<SkillProgressDto>
                    {
                        new() { SkillName = "Python", Percentage = 85 },
                        new() { SkillName = "Css", Percentage = 50 },
                        new() { SkillName = "Html", Percentage = 70 },
                        new() { SkillName = ".Net", Percentage = 90 }
                    };
                }

                // 4. جلب تفاعل الطالب في الـ VLE لحساب ساعات المذاكرة
                List<StudentVle> studentVleActivity = new();
                if (user.StudentId.HasValue)
                {
                    studentVleActivity = await _context.StudentVles
                        .Where(v => v.IdStudent == user.StudentId.Value) // الفلترة بالـ StudentId الحقيقي
                        .ToListAsync();
                }

                // 5. تجهيز بيانات الـ Line Chart
                List<MonthlyProgressDto> monthlyProgress;

                if (studentVleActivity.Any())
                {
                    // لو عنده تفاعلات حقيقية، بنجمع الـ Clicks ونحولها لساعات (مثلاً كل 50 كليك = ساعة مذاكرة)
                    int totalClicks = studentVleActivity.Sum(v => v.SumClick ?? 0);
                    int calculatedHours = totalClicks / 50;

                    monthlyProgress = new List<MonthlyProgressDto>
                    {
                        new() { Month = "Jan", Progress = (int)(totalClicks * 0.4), StudyHours = (int)(calculatedHours * 0.4) },
                        new() { Month = "Feb", Progress = (int)(totalClicks * 0.3), StudyHours = (int)(calculatedHours * 0.3) },
                        new() { Month = "Mar", Progress = (int)(totalClicks * 0.9), StudyHours = (int)(calculatedHours * 0.9) },
                        new() { Month = "Apr", Progress = (int)(totalClicks * 0.5), StudyHours = (int)(calculatedHours * 0.5) },
                        new() { Month = "May", Progress = (int)(totalClicks * 0.6), StudyHours = (int)(calculatedHours * 0.6) },
                        new() { Month = "Jun", Progress = (int)(totalClicks * 0.7), StudyHours = (int)(calculatedHours * 0.7) },
                        new() { Month = "Jul", Progress = totalClicks, StudyHours = calculatedHours }
                    };
                }
                else
                {
                    // بيانات افتراضية ممتازة للـ UI لو الطالب لسه جديد ومظهرش تفاعلات
                    monthlyProgress = new List<MonthlyProgressDto>
                    {
                        new() { Month = "Jan", Progress = 2500, StudyHours = 4000 },
                        new() { Month = "Feb", Progress = 1800, StudyHours = 3000 },
                        new() { Month = "Mar", Progress = 9500, StudyHours = 2000 },
                        new() { Month = "Apr", Progress = 4000, StudyHours = 3000 },
                        new() { Month = "May", Progress = 4800, StudyHours = 2000 },
                        new() { Month = "Jun", Progress = 4000, StudyHours = 2800 },
                        new() { Month = "Jul", Progress = 4200, StudyHours = 3800 }
                    };
                }

                var response = new AnalyticsDashboardDto
                {
                    MonthlyProgress = monthlyProgress,
                    SkillsProgress = skillsProgress
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "حدث خطأ أثناء تحميل بيانات الإحصائيات", error = ex.Message });
            }
        }
    }
}