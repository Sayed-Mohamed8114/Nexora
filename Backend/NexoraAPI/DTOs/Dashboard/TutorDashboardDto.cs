using System.Collections.Generic;

namespace NexoraAPI.DTOs.Dashboard;

public class TutorDashboardDto
{
    public int TutorId { get; set; }
    public string TutorName { get; set; } = string.Empty;
    public string TutorEmail { get; set; } = string.Empty;

    public int TotalCourses { get; set; }
    public int TotalEnrolledStudents { get; set; }
    public int TotalUnenrolledStudents { get; set; }
    public int TotalStudents { get; set; }
    public double OverallSuccessPercentage { get; set; }
    public int TotalAssessments { get; set; }

    public List<TutorCourseStatsDto> Courses { get; set; } = new();
}
