using Microsoft.EntityFrameworkCore;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.implementations
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            return await _context.Courses.ToListAsync();
        }

        public async Task<Course?> GetCourseByCodeAsync(string codeModule, string codePresentation)
        {
            return await _context.Courses
                .FirstOrDefaultAsync(c => c.CodeModule == codeModule && c.CodePresentation == codePresentation);
        }

        public async Task<Course> AddCourseAsync(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateCourseAsync(string codeModule, string codePresentation, Course course)
        {
            var existingCourse = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (existingCourse == null) return null;

            await _context.SaveChangesAsync();
            return existingCourse;
        }

        public async Task<bool> DeleteCourseAsync(string codeModule, string codePresentation)
        {
            var course = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Course>> GetCoursesByTutorIdAsync(int tutorId)
        {
            return await _context.Courses.Where(c => c.TutorId == tutorId).ToListAsync();
        }

        public async Task<bool> EnrollStudentAsync(int studentId, string codeModule, string codePresentation)
        {
            var course = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return false;

            // Check if already enrolled
            var existingInfo = await _context.StudentInfos
                .FirstOrDefaultAsync(si => si.IdStudent == studentId && si.CodeModule == codeModule && si.CodePresentation == codePresentation);
            
            if (existingInfo != null) return true; // Already enrolled

            var studentInfo = new StudentInfo
            {
                IdStudent = studentId,
                CodeModule = codeModule,
                CodePresentation = codePresentation
                // other default fields could be set here
            };

            var registration = new StudentRegistration
            {
                IdStudent = studentId,
                CodeModule = codeModule,
                CodePresentation = codePresentation,
                DateRegistration = 0 // Using 0 as a default for now, could be current day offset
            };

            _context.StudentInfos.Add(studentInfo);
            _context.StudentRegistrations.Add(registration);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnenrollStudentAsync(int studentId, string codeModule, string codePresentation)
        {
            var registration = await _context.StudentRegistrations
                .FirstOrDefaultAsync(sr => sr.IdStudent == studentId && sr.CodeModule == codeModule && sr.CodePresentation == codePresentation);
            var info = await _context.StudentInfos
                .FirstOrDefaultAsync(si => si.IdStudent == studentId && si.CodeModule == codeModule && si.CodePresentation == codePresentation);

            if (registration != null) _context.StudentRegistrations.Remove(registration);
            if (info != null) _context.StudentInfos.Remove(info);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}