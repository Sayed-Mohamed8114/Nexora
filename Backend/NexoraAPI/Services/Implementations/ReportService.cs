using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Reports;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnrolledCourseWithReportDto>> GetEnrolledCoursesWithReportsAsync(int studentId)
        {
            // Get all student enrollments
            var enrollments = await _context.StudentInfos
                .Where(si => si.IdStudent == studentId)
                .Include(si => si.Course)
                    .ThenInclude(c => c.Tutor)
                .Include(si => si.Course)
                    .ThenInclude(c => c.CourseSkillTags)
                .ToListAsync();

            // Get all reports submitted by this student
            var studentReports = await _context.CourseReports
                .Where(r => r.StudentId == studentId)
                .ToListAsync();

            var result = new List<EnrolledCourseWithReportDto>();

            foreach (var si in enrollments)
            {
                var report = studentReports.FirstOrDefault(r =>
                    r.CodeModule == si.CodeModule &&
                    r.CodePresentation == si.CodePresentation);

                result.Add(new EnrolledCourseWithReportDto
                {
                    CodeModule = si.Course.CodeModule,
                    CodePresentation = si.Course.CodePresentation,
                    Name = si.Course.Name,
                    Description = si.Course.Description,
                    Hours = si.Course.Hours,
                    TutorId = si.Course.TutorId,
                    TutorName = si.Course.Tutor != null
                        ? $"{si.Course.Tutor.FirstName} {si.Course.Tutor.LastName}".Trim()
                        : string.Empty,
                    Skills = si.Course.CourseSkillTags.Select(t => t.SkillName).ToList(),

                    ReportId = report?.Id,
                    Rating = report?.Rating,
                    Comment = report?.Comment,
                    ReportedAt = report?.CreatedAt
                });
            }

            return result;
        }

        public async Task<IEnumerable<CourseReportResponseDto>> GetReportsForTutorAsync(int tutorId)
        {
            // Fetch reports where course has TutorId matching tutorId
            var reports = await _context.CourseReports
                .Include(r => r.Course)
                    .ThenInclude(c => c!.Tutor)
                .Include(r => r.Course)
                    .ThenInclude(c => c!.CourseSkillTags)
                .Where(r => r.Course != null && r.Course.TutorId == tutorId)
                .ToListAsync();

            return await ProjectReportsAsync(reports);
        }

        public async Task<IEnumerable<CourseReportResponseDto>> GetAllReportsAsync()
        {
            var reports = await _context.CourseReports
                .Include(r => r.Course)
                    .ThenInclude(c => c!.Tutor)
                .Include(r => r.Course)
                    .ThenInclude(c => c!.CourseSkillTags)
                .ToListAsync();

            return await ProjectReportsAsync(reports);
        }

        public async Task<(bool Success, string? Error)> SubmitOrUpdateReportAsync(int studentId, SubmitReportDto dto)
        {
            // Validate enrollment
            var isEnrolled = await _context.StudentInfos.AnyAsync(s =>
                s.IdStudent == studentId &&
                s.CodeModule == dto.CodeModule &&
                s.CodePresentation == dto.CodePresentation);

            if (!isEnrolled)
            {
                return (false, "You are not enrolled in this course. You can only review courses you are enrolled in.");
            }

            var existingReport = await _context.CourseReports.FirstOrDefaultAsync(r =>
                r.StudentId == studentId &&
                r.CodeModule == dto.CodeModule &&
                r.CodePresentation == dto.CodePresentation);

            if (existingReport != null)
            {
                existingReport.Rating = dto.Rating;
                existingReport.Comment = dto.Comment;
                existingReport.CreatedAt = DateTime.Now;
                _context.CourseReports.Update(existingReport);
            }
            else
            {
                var newReport = new CourseReport
                {
                    StudentId = studentId,
                    CodeModule = dto.CodeModule,
                    CodePresentation = dto.CodePresentation,
                    Rating = dto.Rating,
                    Comment = dto.Comment,
                    CreatedAt = DateTime.Now
                };
                _context.CourseReports.Add(newReport);
            }

            await _context.SaveChangesAsync();
            return (true, null);
        }

        private async Task<IEnumerable<CourseReportResponseDto>> ProjectReportsAsync(List<CourseReport> reports)
        {
            if (!reports.Any())
            {
                return Enumerable.Empty<CourseReportResponseDto>();
            }

            // Get unique student IDs to query student names from Users
            var studentIds = reports.Select(r => r.StudentId).Distinct().ToList();
            var users = await _context.Users
                .Where(u => u.StudentId.HasValue && studentIds.Contains(u.StudentId.Value))
                .ToListAsync();

            var result = new List<CourseReportResponseDto>();

            foreach (var r in reports)
            {
                var studentUser = users.FirstOrDefault(u => u.StudentId == r.StudentId);
                var studentName = studentUser != null
                    ? $"{studentUser.FirstName} {studentUser.LastName}".Trim()
                    : $"Student #{r.StudentId}";

                result.Add(new CourseReportResponseDto
                {
                    Id = r.Id,
                    CodeModule = r.CodeModule,
                    CodePresentation = r.CodePresentation,
                    CourseName = r.Course?.Name ?? string.Empty,
                    CourseDescription = r.Course?.Description ?? string.Empty,
                    Hours = r.Course?.Hours ?? 0,
                    TutorId = r.Course?.TutorId,
                    TutorName = r.Course?.Tutor != null
                        ? $"{r.Course.Tutor.FirstName} {r.Course.Tutor.LastName}".Trim()
                        : string.Empty,
                    Skills = r.Course?.CourseSkillTags?.Select(t => t.SkillName).ToList() ?? new List<string>(),
                    StudentId = r.StudentId,
                    StudentName = studentName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                });
            }

            return result;
        }
    }
}
