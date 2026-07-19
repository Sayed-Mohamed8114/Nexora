using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs;
using NexoraAPI.DTOs.Recommendations;
using NexoraAPI.Services.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexoraAPI.Models;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationEngineService _recommendationEngine;
        private readonly AppDbContext _context;

        public RecommendationsController(
            IRecommendationEngineService recommendationEngine,
            AppDbContext context)
        {
            _recommendationEngine = recommendationEngine;
            _context = context;
        }

        // ============================================================
        // Returns personalized course recommendations for the logged-in student.
        // ============================================================
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetStudentRecommendations()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new ApiErrorDto { Message = "User is not authenticated." });
            }

            // Fetch the user to get their StudentId and name
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null)
            {
                return NotFound(new ApiErrorDto { Message = "User not found." });
            }

            var studentId = user.StudentId ?? user.Id;

            var recommendations =
                await _recommendationEngine.GenerateRecommendationsAsync(userId.Value, studentId);

            var response = new RecommendationResponseDto
            {
                StudentId = studentId,
                StudentName = $"{user.FirstName} {user.LastName}".Trim(),
                RecommendationCount = recommendations.Count,
                GeneratedAt = DateTime.Now,
                Recommendations = recommendations
            };

            return Ok(response);
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }
    }
}