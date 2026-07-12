using System;
using System.Collections.Generic;
using NexoraAPI.Enums;

namespace NexoraAPI.Models;

public partial class User
{
    public int Id { get; set; }

    public int? StudentId { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public bool EmailVerified { get; set; } = false;

    public UserRole Role { get; set; } = UserRole.Student;

    public DateTime? LastLogin { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual UserProfile? Profile { get; set; }
}
