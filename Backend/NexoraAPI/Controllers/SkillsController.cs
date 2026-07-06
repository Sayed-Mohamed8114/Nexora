using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs.Skills;
using NexoraAPI.Services.Interfaces;
using System.Security.Claims;

namespace NexoraAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    /// <summary>
    /// Get all desired skills for the current student.
    /// Note: progress and recommendations come from GET /api/dashboard.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetSkills()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var skills = await _skillService.GetSkillsAsync(userId.Value);
        return Ok(skills);
    }

    /// <summary>
    /// Add a new desired skill. The system will auto-recommend matching courses.
    /// Returns 409 if the skill name already exists for this student.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddSkill([FromBody] UpdateSkillDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var created = await _skillService.AddSkillAsync(userId.Value, dto);
        if (created == null)
            return Conflict($"You already added '{dto.SkillName}' as a desired skill.");

        return CreatedAtAction(nameof(GetSkills), created);
    }

    /// <summary>
    /// Update an existing desired skill (name or target level).
    /// </summary>
    [HttpPut("{skillId}")]
    public async Task<IActionResult> UpdateSkill(int skillId, [FromBody] UpdateSkillDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var result = await _skillService.UpdateSkillAsync(userId.Value, skillId, dto);
        if (!result) return NotFound("Skill not found.");

        return Ok(new { message = "Skill updated. Check /api/dashboard for updated recommendations." });
    }

    /// <summary>
    /// Remove a desired skill and its recommendations from the dashboard.
    /// </summary>
    [HttpDelete("{skillId}")]
    public async Task<IActionResult> DeleteSkill(int skillId)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var result = await _skillService.DeleteSkillAsync(userId.Value, skillId);
        if (!result) return NotFound("Skill not found.");

        return Ok(new { message = "Skill removed from your dashboard." });
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }
}
