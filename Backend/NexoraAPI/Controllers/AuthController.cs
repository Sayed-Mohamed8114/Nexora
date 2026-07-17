using Microsoft.AspNetCore.Mvc;
using NexoraAPI.DTOs.Auth;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var (success, error) = await _authService.RegisterAsync(dto);

            if (!success)
                return BadRequest(new { message = error });

            return Ok(new { message = "Registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            if (result == null)
                return Unauthorized(new { message = "Invalid Email or Password." });

            return Ok(result);
        }
    }
}