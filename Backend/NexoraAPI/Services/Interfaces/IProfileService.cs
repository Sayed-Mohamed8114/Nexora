using NexoraAPI.DTOs.Profile;

namespace NexoraAPI.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetProfileAsync(int userId);

        Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto);

        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}