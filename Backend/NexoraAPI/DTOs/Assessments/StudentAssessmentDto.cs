namespace NexoraAPI.DTOs
{
    public class StudentAssessmentDto
    {
        public int AssessmentId { get; set; }
        public string? CodeModule { get; set; }
        public string? AssessmentType { get; set; }
        public double? Score { get; set; }
        public string? DateSubmitted { get; set; }
        public bool IsBanked { get; set; }
    }
}
