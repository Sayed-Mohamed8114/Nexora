using NexoraAPI.DTOs.Skills;

namespace NexoraAPI.Services.Interfaces;

public interface ISkillService
{
    Task<List<StudentSkillDto>> GetSkillsAsync(int userId);
    Task<StudentSkillDto?> AddSkillAsync(int userId, UpdateSkillDto dto);
    Task<bool> UpdateSkillAsync(int userId, int skillId, UpdateSkillDto dto);
    Task<bool> DeleteSkillAsync(int userId, int skillId);
}
