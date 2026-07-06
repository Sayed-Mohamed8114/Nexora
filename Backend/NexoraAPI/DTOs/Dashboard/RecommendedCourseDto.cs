namespace NexoraAPI.DTOs.Dashboard;

public class RecommendedCourseDto
{
    public string CodeModule { get; set; } = string.Empty;
    public string CodePresentation { get; set; } = string.Empty;

    /// <summary>The skill level this course teaches: Beginner / Intermediate / Advanced</summary>
    public string Level { get; set; } = string.Empty;

    /// <summary>
    /// True if the student already has any VLE activity (clicks) in this course.
    /// Used to compute progress and visually mark "in progress" courses on the frontend.
    /// </summary>
    public bool IsEngaged { get; set; }
}
