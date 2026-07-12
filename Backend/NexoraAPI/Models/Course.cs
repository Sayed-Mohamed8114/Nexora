using System;
using System.Collections.Generic;

namespace NexoraAPI.Models;

public partial class Course
{
    public string CodeModule { get; set; } = null!;

    public string CodePresentation { get; set; } = null!;

    public virtual ICollection<Assessment> Assessments { get; set; } = new List<Assessment>();

    public virtual ICollection<StudentInfo> StudentInfos { get; set; } = new List<StudentInfo>();

    public virtual ICollection<Vle> Vles { get; set; } = new List<Vle>();

    public int? TutorId { get; set; }

    public virtual User? Tutor { get; set; }
}
