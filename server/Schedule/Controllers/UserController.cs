using Application.Interfaces;
using Application.Services;
using Business.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Schedule.Controllers
{
    public class UserController : BaseApiController
    {


        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }



        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserDTO userDto)
        {

            try
            {
                var result = await _userService.Register(userDto);
                return Ok(result);
            }
            catch (ArgumentNullException e)
            {
                return NotFound($"An error occurred: {e.Message}");
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering user. Message: {Message}, Inner Exception: {InnerException}", ex.Message, ex.InnerException?.Message);
                throw; 
            }


        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var token = await _userService.Login(loginDto);
                return Ok(token);
            }
            catch (ArgumentNullException e)
            {
                return NotFound($"An error occurred: {e.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }


        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var dashboardDto = await _userService.GetDashboard();
            return Ok(dashboardDto);
        }
        
        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs()
        {
            var JobDto = await _userService.GetJobs();
            return Ok(JobDto);
        }
        
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var GetUsersDTO = await _userService.GetUsers();
            return Ok(GetUsersDTO);
        }

    }
}
