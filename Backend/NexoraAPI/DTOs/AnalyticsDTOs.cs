namespace NexoraAPI.DTOs
{
    public class MonthlyProgressDto
    {
        public string Month { get; set; } = string.Empty;
        public int Progress { get; set; }
        public int StudyHours { get; set; }
    }

    public class SkillProgressDto
    {
        public string SkillName { get; set; } = string.Empty;
        public int Percentage { get; set; }
    }

    public class AnalyticsDashboardDto
    {
        public List<MonthlyProgressDto> MonthlyProgress { get; set; } = new();
        public List<SkillProgressDto> SkillsProgress { get; set; } = new();
    }
}