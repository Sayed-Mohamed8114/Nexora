using NexoraAPI.DTOs.Auth;

namespace NexoraAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string? Error)> RegisterAsync(RegisterDto dto);

        Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    }
}