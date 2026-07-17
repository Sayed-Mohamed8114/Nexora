using System.ComponentModel.DataAnnotations;

namespace NexoraAPI.DTOs.Auth
{
    public class RegisterDto
    {
        /// <summary>
        /// Required only when Role is Student.
        /// </summary>
        public int? StudentId { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 8,
            ErrorMessage = "Password must be between 8 and 100 characters.")]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, " +
                           "one lowercase letter, one digit, and one special character " +
                           "(e.g. !, @, #, $, %, &).")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "The email address format is invalid (e.g. user@example.com).")]
        [StringLength(256, ErrorMessage = "Email address must not exceed 256 characters.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, MinimumLength = 2,
            ErrorMessage = "First name must be between 2 and 50 characters.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50, MinimumLength = 2,
            ErrorMessage = "Last name must be between 2 and 50 characters.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required (Student or Tutor).")]
        [EnumDataType(typeof(Enums.UserRole),
            ErrorMessage = "Role must be a valid value: Student or Tutor.")]
        public Enums.UserRole Role { get; set; } = Enums.UserRole.Student;
    }
}