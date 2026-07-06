using System.ComponentModel.DataAnnotations;

namespace NexoraAPI.DTOs.Skills;

public class UpdateSkillDto
{
    [Required]
    [MaxLength(100)]
    public string SkillName { get; set; } = string.Empty;

    /// <summary>Must be one of: "Beginner", "Intermediate", "Advanced"</summary>
    [Required]
    [RegularExpression("^(Beginner|Intermediate|Advanced)$",
        ErrorMessage = "TargetLevel must be Beginner, Intermediate, or Advanced.")]
    public string TargetLevel { get; set; } = "Beginner";
}
