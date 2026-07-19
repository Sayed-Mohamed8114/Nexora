using NexoraAPI.DTOs.Courses;
using System;
using System.Collections.Generic;

namespace NexoraAPI.DTOs.Recommendations
{
    public class RecommendationResponseDto
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int RecommendationCount { get; set; }
        public DateTime GeneratedAt { get; set; }
        public List<CourseResponseDto> Recommendations { get; set; } = new();
    }
}
