using Microsoft.EntityFrameworkCore;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations;

/// <summary>
/// Runs every 24 hours and auto-generates notifications for students based on:
/// 1. Inactivity: No VLE clicks on a module in the past 7 days
/// 2. GPA improvement: Average score is higher than the week-ago average
/// </summary>
public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<NotificationBackgroundService> _logger;

    // How often the background job runs
    private readonly TimeSpan _interval = TimeSpan.FromHours(24);

    public NotificationBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<NotificationBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("NotificationBackgroundService started.");

        // Wait a short delay before the first run so the app can fully start up
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunChecksAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in NotificationBackgroundService.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private async Task RunChecksAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var notifService = scope.ServiceProvider.GetRequiredService<INotificationService>();

        // Get all users who are students and have a linked StudentId
        var students = await context.Users
            .Where(u => u.StudentId.HasValue)
            .ToListAsync();

        // Today represented as days since the OULAD epoch (day 0 = course start)
        // StudentVle.Date is an integer representing relative day number
        // We use current UTC date to simulate "this week" as the last 7 days of data
        var allVleDates = await context.StudentVles
            .Where(sv => sv.Date.HasValue)
            .Select(sv => sv.Date!.Value)
            .Distinct()
            .ToListAsync();

        // Use the maximum date in the dataset as "today" for comparison
        int maxDate = allVleDates.Count > 0 ? allVleDates.Max() : 0;
        int sevenDaysAgo = maxDate - 7;

        foreach (var user in students)
        {
            await CheckInactivityAsync(context, notifService, user, sevenDaysAgo, maxDate);
            await CheckGpaImprovementAsync(context, notifService, user, sevenDaysAgo);
        }
    }

    /// <summary>
    /// Notifies student if they had zero VLE clicks on any of their modules in the last 7 days.
    /// </summary>
    private async Task CheckInactivityAsync(
        AppDbContext context,
        INotificationService notifService,
        User user,
        int sevenDaysAgo,
        int maxDate)
    {
        // Get modules the student is enrolled in
        var modules = await context.StudentInfos
            .Where(si => si.IdStudent == user.StudentId!.Value)
            .Select(si => si.CodeModule)
            .Distinct()
            .ToListAsync();

        foreach (var module in modules)
        {
            // Check if any clicks exist in the last 7 days for this module
            bool hasActivity = await context.StudentVles
                .AnyAsync(sv =>
                    sv.IdStudent == user.StudentId!.Value &&
                    sv.CodeModule == module &&
                    sv.Date >= sevenDaysAgo &&
                    sv.Date <= maxDate &&
                    sv.SumClick > 0);

            if (!hasActivity)
            {
                // Avoid duplicate notifications: check if we already sent one recently
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.UserId == user.Id &&
                        n.Type == "InactiveModule" &&
                        n.Message.Contains(module) &&
                        n.CreatedAt >= DateTime.Now.AddDays(-7));

                if (!alreadyNotified)
                {
                    await notifService.SendNotificationAsync(
                        userId: user.Id,
                        title: "📚 Don't fall behind!",
                        message: $"You haven't studied {module} this week. Keep your momentum going!",
                        type: "InactiveModule"
                    );
                }
            }
        }
    }

    /// <summary>
    /// Notifies student if their recent assessment average is higher than their overall average.
    /// </summary>
    private async Task CheckGpaImprovementAsync(
        AppDbContext context,
        INotificationService notifService,
        User user,
        int sevenDaysAgo)
    {
        var scores = await context.StudentAssessments
            .Where(sa => sa.IdStudent == user.StudentId!.Value && sa.Score.HasValue)
            .Select(sa => new { sa.DateSubmitted, sa.Score })
            .ToListAsync();

        if (scores.Count < 2) return;

        double overallAvg = scores.Average(s => s.Score!.Value);
        var recentScores = scores
            .Where(s => s.DateSubmitted.HasValue && s.DateSubmitted.Value >= sevenDaysAgo)
            .Select(s => s.Score!.Value)
            .ToList();

        if (!recentScores.Any()) return;

        double recentAvg = recentScores.Average();

        // Only notify if recent average is meaningfully higher (>= 5% improvement)
        if (recentAvg >= overallAvg + 5)
        {
            bool alreadyNotified = await context.Notifications
                .AnyAsync(n =>
                    n.UserId == user.Id &&
                    n.Type == "GpaIncrease" &&
                    n.CreatedAt >= DateTime.Now.AddDays(-7));

            if (!alreadyNotified)
            {
                await notifService.SendNotificationAsync(
                    userId: user.Id,
                    title: "🎉 Your GPA is going up!",
                    message: $"Great job! Your recent average is {recentAvg:F1}%, up from your overall average of {overallAvg:F1}%. Keep it up!",
                    type: "GpaIncrease"
                );
            }
        }
    }
}
