using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs.Skills;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseSkillTagsController : ControllerBase
{
    private readonly ICourseSkillTagService _tagService;

    public CourseSkillTagsController(ICourseSkillTagService tagService)
    {
        _tagService = tagService;
    }

    /// <summary>
    /// Get all course-skill tags. Public so frontend can display which skills each course teaches.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await _tagService.GetAllTagsAsync();
        return Ok(tags);
    }

    /// <summary>
    /// Get all courses tagged with a specific skill.
    /// e.g. GET /api/course-skill-tags/by-skill?skill=Python
    /// </summary>
    [HttpGet("by-skill")]
    public async Task<IActionResult> GetBySkill([FromQuery] string skill)
    {
        if (string.IsNullOrWhiteSpace(skill))
            return BadRequest("Skill name is required.");

        var tags = await _tagService.GetTagsBySkillAsync(skill);
        return Ok(tags);
    }

    /// <summary>
    /// Add a skill tag to a course. Only Tutors can do this.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> AddTag([FromBody] AddCourseSkillTagDto dto)
    {
        var created = await _tagService.AddTagAsync(dto);
        if (created == null)
            return Conflict("Tag already exists or the course was not found.");

        return CreatedAtAction(nameof(GetAll), created);
    }

    /// <summary>
    /// Remove a skill tag from a course. Only Tutors can do this.
    /// </summary>
    [HttpDelete("{tagId}")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> DeleteTag(int tagId)
    {
        var result = await _tagService.DeleteTagAsync(tagId);
        if (!result) return NotFound("Tag not found.");

        return Ok(new { message = "Tag removed successfully." });
    }
}
