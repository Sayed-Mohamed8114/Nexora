using System;

namespace NexoraAPI.DTOs.Reports
{
    public class CourseReportResponseDto
    {
        public int Id { get; set; }
        public string CodeModule { get; set; } = string.Empty;
        public string CodePresentation { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseDescription { get; set; } = string.Empty;
        public int Hours { get; set; }
        public int? TutorId { get; set; }
        public string TutorName { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
