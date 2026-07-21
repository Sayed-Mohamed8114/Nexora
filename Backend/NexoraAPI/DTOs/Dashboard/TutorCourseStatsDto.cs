namespace NexoraAPI.DTOs.Dashboard;

public class TutorCourseStatsDto
{
    public string CodeModule { get; set; } = string.Empty;
    public string CodePresentation { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Hours { get; set; }

    /// <summary>Number of active students currently enrolled in this course.</summary>
    public int EnrolledCount { get; set; }

    /// <summary>Number of students who unenrolled or withdrew from this course.</summary>
    public int UnenrolledCount { get; set; }

    /// <summary>Total students registered (EnrolledCount + UnenrolledCount).</summary>
    public int TotalStudentsCount { get; set; }

    /// <summary>Percentage of success calculated as (EnrolledCount / TotalStudentsCount) * 100.</summary>
    public double SuccessPercentage { get; set; }

    /// <summary>Total number of assessments created for this course.</summary>
    public int AssessmentCount { get; set; }

    /// <summary>Skill tags associated with this course.</summary>
    public List<string> Skills { get; set; } = new();
}
