using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Skills;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations;

public class CourseSkillTagService : ICourseSkillTagService
{
    private readonly AppDbContext _context;

    public CourseSkillTagService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseSkillTagDto>> GetAllTagsAsync()
    {
        return await _context.CourseSkillTags
            .OrderBy(t => t.SkillName)
            .ThenBy(t => t.Level)
            .Select(t => new CourseSkillTagDto
            {
                Id = t.Id,
                CodeModule = t.CodeModule,
                CodePresentation = t.CodePresentation,
                SkillName = t.SkillName,
                Level = t.Level
            })
            .ToListAsync();
    }

    public async Task<List<CourseSkillTagDto>> GetTagsBySkillAsync(string skillName)
    {
        return await _context.CourseSkillTags
            .Where(t => t.SkillName.ToLower() == skillName.ToLower())
            .OrderBy(t => t.Level)
            .Select(t => new CourseSkillTagDto
            {
                Id = t.Id,
                CodeModule = t.CodeModule,
                CodePresentation = t.CodePresentation,
                SkillName = t.SkillName,
                Level = t.Level
            })
            .ToListAsync();
    }

    public async Task<CourseSkillTagDto?> AddTagAsync(AddCourseSkillTagDto dto)
    {
        // Verify the course exists
        bool courseExists = await _context.Courses.AnyAsync(c =>
            c.CodeModule == dto.CodeModule &&
            c.CodePresentation == dto.CodePresentation);

        if (!courseExists) return null;

        // Prevent exact duplicate tag (same course + same skill + same level)
        bool duplicate = await _context.CourseSkillTags.AnyAsync(t =>
            t.CodeModule == dto.CodeModule &&
            t.CodePresentation == dto.CodePresentation &&
            t.SkillName.ToLower() == dto.SkillName.ToLower() &&
            t.Level == dto.Level);

        if (duplicate) return null;

        var tag = new CourseSkillTag
        {
            CodeModule = dto.CodeModule,
            CodePresentation = dto.CodePresentation,
            SkillName = dto.SkillName.Trim(),
            Level = dto.Level
        };

        _context.CourseSkillTags.Add(tag);
        await _context.SaveChangesAsync();

        return new CourseSkillTagDto
        {
            Id = tag.Id,
            CodeModule = tag.CodeModule,
            CodePresentation = tag.CodePresentation,
            SkillName = tag.SkillName,
            Level = tag.Level
        };
    }

    public async Task<bool> DeleteTagAsync(int tagId)
    {
        var tag = await _context.CourseSkillTags.FindAsync(tagId);
        if (tag == null) return false;

        _context.CourseSkillTags.Remove(tag);
        await _context.SaveChangesAsync();
        return true;
    }
}
