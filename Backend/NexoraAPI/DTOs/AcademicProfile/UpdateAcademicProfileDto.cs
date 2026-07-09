public class UpdateAcademicProfileDto
{
    // Personal Details
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    // Academic Details
    public string? Gender { get; set; }

    public string? HighestEducation { get; set; }

    public string? AgeBand { get; set; }

    public string? Region { get; set; }

    public string? ImdBand { get; set; }

    public int? StudiedCredits { get; set; }

    public int? NumOfPrevAttempts { get; set; }

    public string? Disability { get; set; }
}
