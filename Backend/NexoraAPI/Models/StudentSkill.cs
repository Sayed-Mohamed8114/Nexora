using System;

namespace NexoraAPI.Models;

public class StudentSkill
{
    public int Id { get; set; }

    public int UserId { get; set; }

    /// <summary>e.g. "Python", "Web Development", "Machine Learning"</summary>
    public string SkillName { get; set; } = string.Empty;

    /// <summary>"Beginner" | "Intermediate" | "Advanced"</summary>
    public string TargetLevel { get; set; } = "Beginner";

    public DateTime AddedAt { get; set; } = DateTime.Now;

    // Progress is NOT stored — computed on-the-fly from VLE activity
    public virtual User User { get; set; } = null!;
}
