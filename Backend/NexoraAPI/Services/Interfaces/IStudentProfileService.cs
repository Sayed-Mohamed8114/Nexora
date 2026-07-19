using System.Collections.Generic;
using System.Threading.Tasks;
using NexoraAPI.DTOs;
using NexoraAPI.Models;

namespace NexoraAPI.Services.Interfaces
{
    public interface IStudentProfileService
    {
        Task<User?> GetStudentBasicInfo(int studentId);
        Task<double> GetAverageScore(int studentId);
        Task<List<string>> GetStudentSkills(int studentId);
        Task<List<string>> GetWeakSubjects(int studentId);
        Task<StudentProfileDto?> GetStudentProfileAsync(int studentId);

        Task<int> GetTotalClicks(int studentId);
        string GetEngagementLevel(int totalClicks);
        string GetPerformanceLevel(double averageScore, bool hasAssessments);
    }
}
