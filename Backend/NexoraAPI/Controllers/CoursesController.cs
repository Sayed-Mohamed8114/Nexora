using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            if (role == "Tutor" && userId.HasValue)
            {
                var tutorCourses = await _courseService.GetCoursesByTutorIdAsync(userId.Value);
                return Ok(tutorCourses);
            }

            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> GetCourse(string codeModule, string codePresentation)
        {
            var course = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return NotFound("Course not found!");

            return Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] Course course)
        {
            if (course == null) return BadRequest();

            var role = GetCurrentUserRole();
            if (role != "Tutor" && role != "Admin") return Forbid("Only Tutors or Admins can create courses.");

            var userId = GetCurrentUserId();
            if (role == "Tutor" && userId.HasValue)
            {
                course.TutorId = userId.Value;
            }

            var createdCourse = await _courseService.AddCourseAsync(course);
            return CreatedAtAction(nameof(GetCourse),
                new { codeModule = createdCourse.CodeModule, codePresentation = createdCourse.CodePresentation },
                createdCourse);
        }

        [HttpPut("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> UpdateCourse(string codeModule, string codePresentation, [FromBody] Course course)
        {
            var role = GetCurrentUserRole();
            if (role != "Tutor" && role != "Admin") return Forbid("Only Tutors or Admins can update courses.");

            var existingCourse = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (existingCourse == null) return NotFound("Course not found to update!");

            var userId = GetCurrentUserId();
            if (role == "Tutor" && existingCourse.TutorId != userId) return Forbid("You can only update your own courses.");

            course.TutorId = existingCourse.TutorId; // Preserve TutorId
            var updatedCourse = await _courseService.UpdateCourseAsync(codeModule, codePresentation, course);
            return Ok(updatedCourse);
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

            // In this system StudentId could be the User Id itself or a mapped StudentId.
            // For simplicity, we use the User.Id to represent the student if StudentId is not present.
            // Ideally we'd look up the User's mapped StudentId. Let's use UserId as a fallback.
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            // Note: If you have a specific StudentId mapping in your DB, you would retrieve it here.
            // We will use userId for the studentId in StudentInfos.
            var success = await _courseService.EnrollStudentAsync(userId.Value, codeModule, codePresentation);
            if (!success) return BadRequest("Could not enroll in course.");

            return Ok(new { message = "Successfully enrolled." });
        }

        [HttpPost("{codeModule}/{codePresentation}/unenroll")]
        public async Task<IActionResult> Unenroll(string codeModule, string codePresentation)
        {
            var role = GetCurrentUserRole();
            if (role != "Student") return Forbid("Only students can unenroll from courses.");

            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var success = await _courseService.UnenrollStudentAsync(userId.Value, codeModule, codePresentation);
            if (!success) return BadRequest("Could not unenroll from course.");

            return Ok(new { message = "Successfully unenrolled." });
        }
    }
}