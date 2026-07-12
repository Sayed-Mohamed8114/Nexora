using System;

namespace NexoraAPI.Models;

public class UserProfile
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public string? Gender { get; set; }
    public string? HighestEducation { get; set; }
    public string? AgeBand { get; set; }
    public string? Region { get; set; }
    public string? ImdBand { get; set; }
    public int? StudiedCredits { get; set; }
    public int? NumOfPrevAttempts { get; set; }
    public string? Disability { get; set; }
    public string? FinalResult { get; set; }

    public virtual User User { get; set; } = null!;
}
