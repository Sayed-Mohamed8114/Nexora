using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexoraAPI.Models
{
    public class CourseReport
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CodeModule { get; set; } = null!;

        [Required]
        public string CodePresentation { get; set; } = null!;

        [Required]
        public int StudentId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }

        [Required]
        [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CodeModule, CodePresentation")]
        public virtual Course? Course { get; set; }
    }
}
