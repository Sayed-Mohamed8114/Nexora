using System.ComponentModel.DataAnnotations;

namespace NexoraAPI.DTOs.Reports
{
    public class SubmitReportDto
    {
        [Required(ErrorMessage = "CodeModule is required.")]
        public string CodeModule { get; set; } = string.Empty;

        [Required(ErrorMessage = "CodePresentation is required.")]
        public string CodePresentation { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rating is required.")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }

        [Required(ErrorMessage = "Comment is required.")]
        [StringLength(1000, MinimumLength = 5, ErrorMessage = "Comment must be between 5 and 1000 characters.")]
        public string Comment { get; set; } = string.Empty;
    }
}
