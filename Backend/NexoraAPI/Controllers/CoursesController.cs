using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs.Courses;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;
using System.Security.Claims;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private string? GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value;
        }

        private static CourseResponseDto ToDto(Course c) => new()
        {
            CodeModule = c.CodeModule,
            CodePresentation = c.CodePresentation,
            Name = c.Name,
            Description = c.Description,
            Hours = c.Hours,
            TutorId = c.TutorId,
            TutorName = c.TutorName,
            Skills = c.Skills,
            EnrolledCount = c.EnrolledCount
        };

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            if (role == "Tutor" && userId.HasValue)
            {
                var tutorCourses = await _courseService.GetCoursesByTutorIdAsync(userId.Value);
                return Ok(tutorCourses.Select(ToDto));
            }

            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses.Select(ToDto));
        }

        [HttpGet("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> GetCourse(string codeModule, string codePresentation)
        {
            var course = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return NotFound("Course not found!");

            return Ok(ToDto(course));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (dto == null) return BadRequest();

            var role = GetCurrentUserRole();
            if (role != "Tutor" && role != "Admin") return Forbid("Only Tutors or Admins can create courses.");

            var userId = GetCurrentUserId();

            var course = new Course
            {
                CodeModule = dto.CodeModule,
                CodePresentation = dto.CodePresentation,
                Name = dto.Name,
                Description = dto.Description,
                Hours = dto.Hours,
                TutorId = (role == "Tutor" && userId.HasValue) ? userId.Value : null
            };

            var createdCourse = await _courseService.AddCourseAsync(course);

            // If skills were provided, sync them now
            if (dto.Skills.Count > 0)
            {
                var updatedCourse = await _courseService.UpdateCourseAsync(
                    createdCourse.CodeModule, createdCourse.CodePresentation,
                    createdCourse, dto.Skills);
                return CreatedAtAction(nameof(GetCourse),
                    new { codeModule = createdCourse.CodeModule, codePresentation = createdCourse.CodePresentation },
                    ToDto(updatedCourse!));
            }

            return CreatedAtAction(nameof(GetCourse),
                new { codeModule = createdCourse.CodeModule, codePresentation = createdCourse.CodePresentation },
                ToDto(createdCourse));
        }

        [HttpPut("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> UpdateCourse(string codeModule, string codePresentation, [FromBody] UpdateCourseDto dto)
        {
            var role = GetCurrentUserRole();
            if (role != "Tutor" && role != "Admin") return Forbid("Only Tutors or Admins can update courses.");

            var existingCourse = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (existingCourse == null) return NotFound("Course not found to update!");

            var userId = GetCurrentUserId();
            if (role == "Tutor" && existingCourse.TutorId != userId) return Forbid("You can only update your own courses.");

            var courseUpdate = new Course
            {
                Name = dto.Name,
                Description = dto.Description,
                Hours = dto.Hours
            };

            var updatedCourse = await _courseService.UpdateCourseAsync(codeModule, codePresentation, courseUpdate, dto.Skills);
            return Ok(ToDto(updatedCourse!));
        }

        [HttpDelete("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> DeleteCourse(string codeModule, string codePresentation)
        {
            var role = GetCurrentUserRole();
            if (role != "Tutor" && role != "Admin") return Forbid("Only Tutors or Admins can delete courses.");

            var existingCourse = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (existingCourse == null) return NotFound("Course not found to delete!");

            var userId = GetCurrentUserId();
            if (role == "Tutor" && existingCourse.TutorId != userId) return Forbid("You can only delete your own courses.");

            var result = await _courseService.DeleteCourseAsync(codeModule, codePresentation);
            return Ok("Course deleted successfully.");
        }

        [HttpPost("{codeModule}/{codePresentation}/enroll")]
        public async Task<IActionResult> Enroll(string codeModule, string codePresentation)
        {
            var role = GetCurrentUserRole();
            if (role != "Student") return Forbid("Only students can enroll in courses.");

            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            // Resolve the correct StudentId
            var studentId = await _courseService.GetStudentIdForUserAsync(userId.Value) ?? userId.Value;

            var success = await _courseService.EnrollStudentAsync(studentId, codeModule, codePresentation);
            if (!success) return BadRequest("Could not enroll in course.");

            return Ok(new { enrolled = true });
        }

        [HttpPost("{codeModule}/{codePresentation}/unenroll")]
        public async Task<IActionResult> Unenroll(string codeModule, string codePresentation)
        {
            var role = GetCurrentUserRole();
            if (role != "Student") return Forbid("Only students can unenroll from courses.");

            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            // Resolve the correct StudentId
            var studentId = await _courseService.GetStudentIdForUserAsync(userId.Value) ?? userId.Value;

            var success = await _courseService.UnenrollStudentAsync(studentId, codeModule, codePresentation);
            if (!success) return BadRequest("Could not unenroll from course.");

            return Ok(new { enrolled = false });
        }

        /// <summary>
        /// Returns all courses the authenticated student is enrolled in,
        /// including enrollment-specific metadata (final result, credits, attempts).
        /// </summary>
        [HttpGet("enrolled")]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            var role = GetCurrentUserRole();
            if (role != "Student") return Forbid("Only students can view their enrolled courses.");

            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            // Resolve the numeric StudentId linked to this user account.
            // User.StudentId is the FK into StudentInfo.IdStudent; fall back to User.Id.
            var studentId = await _courseService.GetStudentIdForUserAsync(userId.Value) ?? userId.Value;

            var courses = await _courseService.GetEnrolledCoursesAsync(studentId);
            return Ok(courses);
        }
    }
}