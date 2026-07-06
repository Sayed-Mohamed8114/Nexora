using System.Collections.Generic;

namespace NexoraAPI.DTOs.Dashboard;

public class SkillProgressDto
{
    public int Id { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string TargetLevel { get; set; } = string.Empty;

    /// <summary>
    /// Auto-calculated: % of skill-tagged courses where the student has VLE activity.
    /// 0 = not started, 100 = active in all recommended courses.
    /// </summary>
    public double Progress { get; set; }

    public List<RecommendedCourseDto> RecommendedCourses { get; set; } = new();
}
