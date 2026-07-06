using System;

namespace NexoraAPI.DTOs.Skills;

public class StudentSkillDto
{
    public int Id { get; set; }
    public string SkillName { get; set; } = string.Empty;

    /// <summary>"Beginner" | "Intermediate" | "Advanced"</summary>
    public string TargetLevel { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}
