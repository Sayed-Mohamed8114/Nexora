using NexoraAPI.DTOs.Dashboard;

namespace NexoraAPI.Services.Interfaces;

public interface IDashboardService
{
    Task<CombinedDashboardDto?> GetCombinedDashboardAsync(int userId);
}
