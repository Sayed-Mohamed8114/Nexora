using System.Collections.Generic;

namespace NexoraAPI.DTOs.Dashboard;

/// <summary>
/// A unified dashboard response that combines stat cards, chart data, and skill progress.
/// Returned by GET /api/Dashboard
/// </summary>
public class CombinedDashboardDto
{
    // ─── Stat Cards ───────────────────────────────────────────────────────────

    /// <summary>Average assessment score converted to a 0–4.0 GPA scale.</summary>
    public double CurrentGpa { get; set; }

    /// <summary>Total course registrations ever.</summary>
    public int TotalCourses { get; set; }

    /// <summary>Courses with a non-null, non-Withdrawn FinalResult.</summary>
    public int CompletedCourses { get; set; }

    /// <summary>Courses still in progress (totalCourses - completedCourses).</summary>
    public int CurrentCourses { get; set; }

    /// <summary>Completion ratio as a percentage (0–100).</summary>
    public double CompletionPercentage { get; set; }


    // ─── Assessment Summary ───────────────────────────────────────────────────

    /// <summary>Total number of assessments the student has submitted.</summary>
    public int TotalAssessmentsSubmitted { get; set; }

    /// <summary>Average score across all submitted assessments (0–100).</summary>
    public double AverageAssessmentScore { get; set; }

    /// <summary>Best (highest) score achieved across all assessments (0–100).</summary>
    public double BestAssessmentScore { get; set; }

    // ─── Chart Data ───────────────────────────────────────────────────────────

    /// <summary>
    /// Per-month assessment score averages built from real date_submitted values.
    /// Only months that have at least one submission are included.
    /// </summary>
    public List<MonthlyAssessmentDto> MonthlyAssessmentProgress { get; set; } = new();

    // ─── Skills ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Student's desired skills, each enriched with:
    /// – real average score from assessments of courses tagged with that skill
    /// – recommended courses not yet enrolled in, ordered by level
    /// </summary>
    public List<EnrichedSkillDto> Skills { get; set; } = new();
}

/// <summary>Real monthly assessment data derived from submitted assessments.</summary>
public class MonthlyAssessmentDto
{
    /// <summary>Month abbreviation, e.g. "Jan", "Feb".</summary>
    public string Month { get; set; } = string.Empty;

    /// <summary>Year number, e.g. 2026.</summary>
    public int Year { get; set; }

    /// <summary>Average score (0–100) of all assessments submitted that month.</summary>
    public double AverageScore { get; set; }

    /// <summary>Number of assessments submitted that month.</summary>
    public int SubmissionCount { get; set; }
}

/// <summary>A student skill enriched with real course-based score data.</summary>
public class EnrichedSkillDto
{
    public int Id { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string TargetLevel { get; set; } = string.Empty;

    /// <summary>
    /// Average score (0–100) from assessments belonging to courses tagged with this skill.
    /// 0 if the student has no relevant assessment submissions.
    /// </summary>
    public double AverageScoreForSkill { get; set; }

    /// <summary>
    /// Engagement-based progress: % of skill-tagged recommended courses
    /// where the student has VLE activity (click data).
    /// </summary>
    public double EngagementProgress { get; set; }

    /// <summary>Recommended courses for this skill that the student is not yet enrolled in.</summary>
    public List<RecommendedCourseDto> RecommendedCourses { get; set; } = new();
}
