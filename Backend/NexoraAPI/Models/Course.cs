using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexoraAPI.Models;

public partial class Course
{
    public string CodeModule { get; set; } = null!;

    public string CodePresentation { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Hours { get; set; }

    [NotMapped]
    public string TutorName { get; set; } = string.Empty;

    public virtual ICollection<Assessment> Assessments { get; set; } = new List<Assessment>();

    public virtual ICollection<StudentInfo> StudentInfos { get; set; } = new List<StudentInfo>();

    public virtual ICollection<Vle> Vles { get; set; } = new List<Vle>();

    public virtual ICollection<CourseSkillTag> CourseSkillTags { get; set; } = new List<CourseSkillTag>();

    [NotMapped]
    public List<string> Skills { get; set; } = new();

    /// <summary>Number of students currently enrolled. Populated by the service layer.</summary>
    [NotMapped]
    public int EnrolledCount { get; set; }


    public int? TutorId { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual User? Tutor { get; set; }
}
