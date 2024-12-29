using Application.Interfaces;
using Business.DTOs;
using Database.Data;
using Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {


        private readonly ScheduleContext _context;
        private readonly IConfiguration _configuration;

        public UserService(ScheduleContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<User> Register(UserDTO userDto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);

            if (existingUser != null)
            {
                throw new ArgumentException("Username already exists.");
            }

            CreatePasswordHash(userDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var userRole = await _context.Roles.FindAsync(2);

            if (userRole == null)
            {
                throw new ArgumentException("Invalid RoleId."); 
            }

            var result = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                RoleId = 2,  
                JobId = userDto.JobId

            };
            _context.Users.Add(result);
            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<string> Login(LoginDTO loginDto)
        {
            

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new ArgumentException("Wrong Password.");
            }

            var token = CreateToken(user);

            return token;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Role, user.RoleId.ToString()),
                
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public async Task<List<ScheduleDTO>> GetDashboard()
        {
            var allSchedules = await _context.Schedules.ToListAsync();

            var dashboardDtoList = allSchedules.Select(s => new ScheduleDTO
            {
                Id = s.Id,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                UserId = s.UserId,
                FirstName = s.FirstName,
                LastName = s.LastName,
                JobId = s.JobId,
                JobTitle = s.JobTitle,
                IsApproved = s.IsApproved
            }).ToList();

            return dashboardDtoList;
        }
        
        public async Task<List<GetJobDTO>> GetJobs()
        {
            var allJobs = await _context.Jobs.ToListAsync();

            var JobDtoList = allJobs.Select(j => new GetJobDTO
            {
                Id = j.Id,
                Title = j.Title,
            }).ToList();

            return JobDtoList;
        }
        
        public async Task<List<GetUsersDTO>> GetUsers()
        {
            var allUsers = await _context.Users.ToListAsync();

            var UserDtoList = allUsers.Select(u => new GetUsersDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                JobId = u.JobId,
                RoleId = u.RoleId
            }).ToList();

            return UserDtoList;
        }
        
    }
}
