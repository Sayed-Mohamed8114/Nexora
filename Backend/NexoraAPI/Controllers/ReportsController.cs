using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs.Reports;
using NexoraAPI.Services.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexoraAPI.Models;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly AppDbContext _context;

        public ReportsController(IReportService reportService, AppDbContext context)
        {
            _reportService = reportService;
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private string? GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value;
        }

        private async Task<int?> GetStudentIdForUserAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.StudentId)
                .FirstOrDefaultAsync();
        }

        [HttpGet]
        public async Task<IActionResult> GetReports()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var role = GetCurrentUserRole();

            if (role == "Student")
            {
                var studentId = await GetStudentIdForUserAsync(userId.Value) ?? userId.Value;
                var coursesWithReports = await _reportService.GetEnrolledCoursesWithReportsAsync(studentId);
                return Ok(coursesWithReports);
            }
            else if (role == "Tutor")
            {
                var reports = await _reportService.GetReportsForTutorAsync(userId.Value);
                return Ok(reports);
            }
            else if (role == "Admin")
            {
                var reports = await _reportService.GetAllReportsAsync();
                return Ok(reports);
            }

            return Forbid("Unsupported role.");
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReport([FromBody] SubmitReportDto dto)
        {
            var role = GetCurrentUserRole();
            if (role != "Student")
            {
                return Forbid("Only students can submit reports/reviews on courses.");
            }

            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var studentId = await GetStudentIdForUserAsync(userId.Value) ?? userId.Value;

            var (success, error) = await _reportService.SubmitOrUpdateReportAsync(studentId, dto);
            if (!success)
            {
                return BadRequest(new { message = error });
            }

            var courses = await _reportService.GetEnrolledCoursesWithReportsAsync(studentId);
            var updatedCourse = courses.FirstOrDefault(c =>
                c.CodeModule == dto.CodeModule &&
                c.CodePresentation == dto.CodePresentation);

            return Ok(updatedCourse);
        }
    }
}
