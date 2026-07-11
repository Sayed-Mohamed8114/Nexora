namespace NexoraAPI.DTOs.Profile
{
    public class ProfileDto
    {
        // Personal Details
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public bool EmailVerified { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? LastLogin { get; set; }

        // Student/Academic Details
        public int? StudentId { get; set; }

        public string? Gender { get; set; }

        public string? HighestEducation { get; set; }

        public string? AgeBand { get; set; }

        public string? Region { get; set; }

        public string? ImdBand { get; set; }

        public int? StudiedCredits { get; set; }

        public int? NumOfPrevAttempts { get; set; }

        public string? Disability { get; set; }

        public string? FinalResult { get; set; }
    }
}