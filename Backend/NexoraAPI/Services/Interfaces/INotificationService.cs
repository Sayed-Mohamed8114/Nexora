using NexoraAPI.DTOs.Notifications;

namespace NexoraAPI.Services.Interfaces;

public interface INotificationService
{
    Task<List<NotificationDto>> GetNotificationsAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task<bool> MarkAsReadAsync(int userId, int notificationId);
    Task<bool> MarkAllAsReadAsync(int userId);

    /// <summary>
    /// Creates a notification in DB and pushes it via SignalR to the target user in real-time.
    /// </summary>
    Task SendNotificationAsync(int userId, string title, string message, string type = "General");
}
