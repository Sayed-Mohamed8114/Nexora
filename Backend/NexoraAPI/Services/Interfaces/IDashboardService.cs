using NexoraAPI.DTOs.Dashboard;

namespace NexoraAPI.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto?> GetDashboardAsync(int userId);
}
