using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Skills;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations;

public class SkillService : ISkillService
{
    private readonly AppDbContext _context;

    public SkillService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentSkillDto>> GetSkillsAsync(int userId)
    {
        return await _context.StudentSkills
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.AddedAt)
            .Select(s => new StudentSkillDto
            {
                Id = s.Id,
                SkillName = s.SkillName,
                TargetLevel = s.TargetLevel,
                AddedAt = s.AddedAt
            })
            .ToListAsync();
    }

    public async Task<StudentSkillDto?> AddSkillAsync(int userId, UpdateSkillDto dto)
    {
        // Prevent duplicate skill names per user (case-insensitive)
        bool exists = await _context.StudentSkills
            .AnyAsync(s => s.UserId == userId &&
                           s.SkillName.ToLower() == dto.SkillName.ToLower());
        if (exists) return null;

        var skill = new StudentSkill
        {
            UserId = userId,
            SkillName = dto.SkillName.Trim(),
            TargetLevel = dto.TargetLevel,
            AddedAt = DateTime.Now
        };

        _context.StudentSkills.Add(skill);
        await _context.SaveChangesAsync();

        return new StudentSkillDto
        {
            Id = skill.Id,
            SkillName = skill.SkillName,
            TargetLevel = skill.TargetLevel,
            AddedAt = skill.AddedAt
        };
    }

    public async Task<bool> UpdateSkillAsync(int userId, int skillId, UpdateSkillDto dto)
    {
        var skill = await _context.StudentSkills
            .FirstOrDefaultAsync(s => s.Id == skillId && s.UserId == userId);

        if (skill == null) return false;

        skill.SkillName = dto.SkillName.Trim();
        skill.TargetLevel = dto.TargetLevel;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteSkillAsync(int userId, int skillId)
    {
        var skill = await _context.StudentSkills
            .FirstOrDefaultAsync(s => s.Id == skillId && s.UserId == userId);

        if (skill == null) return false;

        _context.StudentSkills.Remove(skill);
        await _context.SaveChangesAsync();
        return true;
    }
}
