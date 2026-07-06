using System.ComponentModel.DataAnnotations;

namespace NexoraAPI.DTOs.Skills;

public class AddCourseSkillTagDto
{
    [Required]
    [MaxLength(45)]
    public string CodeModule { get; set; } = string.Empty;

    [Required]
    [MaxLength(45)]
    public string CodePresentation { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string SkillName { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Beginner|Intermediate|Advanced)$",
        ErrorMessage = "Level must be Beginner, Intermediate, or Advanced.")]
    public string Level { get; set; } = "Beginner";
}
