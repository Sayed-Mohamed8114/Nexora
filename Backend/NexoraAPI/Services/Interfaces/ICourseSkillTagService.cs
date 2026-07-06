using NexoraAPI.DTOs.Skills;

namespace NexoraAPI.Services.Interfaces;

public interface ICourseSkillTagService
{
    Task<List<CourseSkillTagDto>> GetAllTagsAsync();
    Task<List<CourseSkillTagDto>> GetTagsBySkillAsync(string skillName);
    Task<CourseSkillTagDto?> AddTagAsync(AddCourseSkillTagDto dto);
    Task<bool> DeleteTagAsync(int tagId);
}
