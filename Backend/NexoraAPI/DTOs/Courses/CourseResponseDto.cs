namespace NexoraAPI.DTOs.Courses;

/// <summary>
/// Returned to both Students and Tutors when fetching courses.
/// </summary>
public class CourseResponseDto
{
    public string CodeModule { get; set; } = string.Empty;
    public string CodePresentation { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Hours { get; set; }
    public int? TutorId { get; set; }
    public string TutorName { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();

    /// <summary>
    /// Total number of students currently enrolled in this course.
    /// </summary>
    public int EnrolledCount { get; set; }
}
