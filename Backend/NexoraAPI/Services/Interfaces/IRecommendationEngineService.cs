using NexoraAPI.DTOs.Courses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NexoraAPI.Services.Interfaces
{
    public interface IRecommendationEngineService
    {
        Task<List<CourseResponseDto>> GenerateRecommendationsAsync(int userId, int studentId);
    }
}
