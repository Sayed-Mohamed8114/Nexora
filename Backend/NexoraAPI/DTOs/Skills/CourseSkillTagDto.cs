namespace NexoraAPI.DTOs.Skills;

public class CourseSkillTagDto
{
    public int Id { get; set; }
    public string CodeModule { get; set; } = string.Empty;
    public string CodePresentation { get; set; } = string.Empty;
    public string SkillName { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
}
