using System;

namespace NexoraAPI.Models;

/// <summary>
/// Tags a Course with a Skill. Added by Tutors/Admins.
/// Enables the recommendation engine to match student desired skills to courses.
/// </summary>
public class CourseSkillTag
{
    public int Id { get; set; }

    public string CodeModule { get; set; } = null!;

    public string CodePresentation { get; set; } = null!;

    /// <summary>e.g. "Python", "Web Development", "Machine Learning"</summary>
    public string SkillName { get; set; } = string.Empty;

    /// <summary>"Beginner" | "Intermediate" | "Advanced"</summary>
    public string Level { get; set; } = "Beginner";

    public virtual Course Course { get; set; } = null!;
}
