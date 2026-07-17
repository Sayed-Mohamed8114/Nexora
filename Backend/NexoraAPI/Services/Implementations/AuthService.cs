using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Auth;
using NexoraAPI.Enums;
using NexoraAPI.Helpers;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<(bool Success, string? Error)> RegisterAsync(RegisterDto dto)
        {
            if (dto.Role == UserRole.Student)
            {
                if (dto.StudentId.HasValue)
                {
                    var studentExists = await _context.StudentInfos
                        .AnyAsync(s => s.IdStudent == dto.StudentId.Value);

                    if (!studentExists)
                        return (false, $"Student ID '{dto.StudentId.Value}' was not found in the system. " +
                                       "Please make sure you are using the ID assigned to you by your institution.");

                    var userExists = await _context.Users
                        .AnyAsync(u => u.StudentId == dto.StudentId.Value);

                    if (userExists)
                        return (false, $"Student ID '{dto.StudentId.Value}' is already linked to an existing account. " +
                                       "If this is your ID, please log in or contact support.");
                }
            }
            else
            {
                // Tutors do not have a StudentId
                dto.StudentId = null;
            }

            // Email Format Check
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                !System.Text.RegularExpressions.Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return (false, "The email address format is invalid. Please use a valid format such as user@example.com.");

            // Password Strength Check (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special)
            if (string.IsNullOrWhiteSpace(dto.Password))
                return (false, "Password is required.");

            if (!System.Text.RegularExpressions.Regex.IsMatch(
                    dto.Password,
                    @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$"))
            {
                var missing = new List<string>();
                if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Password, @"[A-Z]"))
                    missing.Add("at least one uppercase letter (A–Z)");
                if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Password, @"[a-z]"))
                    missing.Add("at least one lowercase letter (a–z)");
                if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Password, @"\d"))
                    missing.Add("at least one digit (0–9)");
                if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Password, @"[^\da-zA-Z]"))
                    missing.Add("at least one special character (e.g. !, @, #, $, %, &)");
                if (dto.Password.Length < 8)
                    missing.Add("a minimum length of 8 characters");

                return (false, "Password is too weak. Your password must include: " +
                               string.Join(", ", missing) + ".");
            }

            // Email Uniqueness Check
            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                return (false, $"An account with the email '{dto.Email}' already exists. " +
                               "Please log in or use a different email address.");

            var user = new User
            {
                StudentId = dto.StudentId,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                EmailVerified = true, // Set to true because the Regex format is valid
                Role = dto.Role,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return null;

            var validPassword =
                PasswordHasher.Verify(dto.Password, user.PasswordHash);

            if (!validPassword)
                return null;

            user.LastLogin = DateTime.Now;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token
            };
        }
    }
}