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
    }
}