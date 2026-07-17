using System.Collections.Generic;
using System.Threading.Tasks;
using NexoraAPI.DTOs.Reports;

namespace NexoraAPI.Services.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<EnrolledCourseWithReportDto>> GetEnrolledCoursesWithReportsAsync(int studentId);
        Task<IEnumerable<CourseReportResponseDto>> GetReportsForTutorAsync(int tutorId);
        Task<IEnumerable<CourseReportResponseDto>> GetAllReportsAsync();
        Task<(bool Success, string? Error)> SubmitOrUpdateReportAsync(int studentId, SubmitReportDto dto);
    }
}
