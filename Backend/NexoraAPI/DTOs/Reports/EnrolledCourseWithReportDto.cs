using System;
using System.Collections.Generic;

namespace NexoraAPI.DTOs.Reports
{
    public class EnrolledCourseWithReportDto
    {
        public string CodeModule { get; set; } = string.Empty;
        public string CodePresentation { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Hours { get; set; }
        public int? TutorId { get; set; }
        public string TutorName { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();

        // Report details (null if not submitted yet)
        public int? ReportId { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? ReportedAt { get; set; }
    }
}
