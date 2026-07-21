using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.Services.Interfaces;
using System.Security.Claims;

namespace NexoraAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Returns a unified student dashboard combining:
    /// - Stat cards (GPA, courses, assessments)
    /// - Real monthly assessment score chart (from actual submission dates)
    /// - Skills enriched with real assessment scores and recommended courses
    /// </summary>
    [HttpGet("student-dashboard")]
    public async Task<IActionResult> GetStudentDashboard()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var dashboard = await _dashboardService.GetCombinedDashboardAsync(userId.Value);
            if (dashboard == null)
                return NotFound(new { success = false, message = "User not found." });

            return Ok(new { success = true, data = dashboard });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Failed to load student dashboard.", error = ex.Message });
        }
    }

    /// <summary>
    /// Returns the dashboard for the currently authenticated tutor.
    /// </summary>
    [HttpGet("tutor-dashboard")]
    public async Task<IActionResult> GetTutorDashboard()
    {
        try
        {
            var dashboard = await _dashboardService.GetTutorDashboardAsync();

            if (dashboard == null)
                return NotFound(new { success = false, message = "Tutor user not found." });

            return Ok(new { success = true, data = dashboard });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Failed to load tutor dashboard.",
                error = ex.Message
            });
        }
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }
}