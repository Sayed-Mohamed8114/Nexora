using System.Collections.Generic;

namespace NexoraAPI.DTOs.Dashboard;

public class DashboardDto
{
    /// <summary>GPA on a 4.0 scale (converted from average assessment score)</summary>
    public double CurrentGpa { get; set; }

    /// <summary>Total number of course registrations for the student</summary>
    public int TotalCourses { get; set; }

    /// <summary>Courses where FinalResult is not null and not "Withdrawn"</summary>
    public int CompletedCourses { get; set; }

    /// <summary>Courses still in progress</summary>
    public int CurrentCourses { get; set; }

    /// <summary>CompletedCourses / TotalCourses * 100</summary>
    public double CompletionPercentage { get; set; }

    /// <summary>Number of unread notifications</summary>
    public int UnreadNotifications { get; set; }

    /// <summary>
    /// Student's desired skills, each with auto-calculated progress
    /// and a list of recommended courses to achieve that skill.
    /// </summary>
    public List<SkillProgressDto> Skills { get; set; } = new();
}
