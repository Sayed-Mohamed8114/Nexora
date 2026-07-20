using System.Collections.Generic;

namespace NexoraAPI.DTOs
{
    public class QuestionOptionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool? IsCorrect { get; set; } // Optional: Returned only for Tutors or when showing results
    }

    public class AssessmentQuestionDto
    {
        public int Id { get; set; }
        public int AssessmentId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public int Points { get; set; }
        public List<QuestionOptionDto> Options { get; set; } = new();
    }

    public class CreateQuestionDto
    {
        public string Text { get; set; } = string.Empty;
        public string QuestionType { get; set; } = "MultipleChoice";
        public int Points { get; set; } = 1;
        public List<CreateOptionDto> Options { get; set; } = new();
    }

    public class CreateOptionDto
    {
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; } = false;
    }

    public class SubmitAnswersDto
    {
        // Maps QuestionId -> Selected OptionId
        public Dictionary<int, int> Answers { get; set; } = new();
    }

    public class CreateAssessmentDto
    {
        public string CodeModule { get; set; } = string.Empty;
        public string CodePresentation { get; set; } = string.Empty;
        public string AssessmentType { get; set; } = "Quiz";
        public string Date { get; set; } = string.Empty;
    }

    public class AvailableAssessmentDto
    {
        public int AssessmentId { get; set; }
        public string CodeModule { get; set; } = string.Empty;
        public string CodePresentation { get; set; } = string.Empty;
        public string AssessmentType { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public double? Score { get; set; }
    }
}
