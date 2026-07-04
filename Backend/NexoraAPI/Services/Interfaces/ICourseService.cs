using NexoraAPI.Models;

namespace NexoraAPI.Services.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<Course>> GetAllCoursesAsync();
        Task<Course?> GetCourseByCodeAsync(string codeModule, string codePresentation);
        Task<Course> AddCourseAsync(Course course);
        Task<Course?> UpdateCourseAsync(string codeModule, string codePresentation, Course course);
        Task<bool> DeleteCourseAsync(string codeModule, string codePresentation);
    }
}
