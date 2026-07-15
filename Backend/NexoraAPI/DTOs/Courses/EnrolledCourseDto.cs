namespace NexoraAPI.DTOs.Courses;

public class EnrolledCourseDto
{
    public string CodeModule { get; set; } = string.Empty;
    public string CodePresentation { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Hours { get; set; }
    public int? TutorId { get; set; }
    public string TutorName { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();

    // Enrollment-specific fields from StudentInfo
    public string? FinalResult { get; set; }
    public int? NumOfPrevAttempts { get; set; }
    public int? StudiedCredits { get; set; }
}
