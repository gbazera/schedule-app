using Application.Interfaces;
using Business.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Schedule.Controllers
{
    public class AdminController: BaseApiController
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("approve-schedule-request")]
        public async Task<IActionResult> ApproveScheduleRequest(int scheduleId)
        {
            try
            {
                var result = await _adminService.ApproveScheduleRequest(scheduleId);

                if (result)
                    return Ok(new { Message = "Schedule request approved successfully." });
                else
                    return BadRequest(new { Message = "Failed to approve schedule request." });
            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }

        }

        [HttpPost("change-user-role")]
        public async Task<IActionResult> ChangeUserRole([FromBody] ChangeUserRoleDTO changeUserRoleDTO)
        {
            try
            {
                var result = await _adminService.ChangeUserRole(changeUserRoleDTO.UserId, changeUserRoleDTO.NewRoleId);

                if (result)
                    return Ok(new { Message = "User role changed successfully." });
                else
                    return BadRequest(new { Message = "Failed to change user role." });

            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("add-new-job")]
        public async Task<IActionResult> AddNewJob([FromBody] JobDTO jobDto)
        {
            try
            {
                var result = await _adminService.AddNewJob(jobDto);

                if (result)
                    return Ok(new { Message = "New job added successfully." });
                else
                    return BadRequest(new { Message = "Failed to add new job." });
            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }

        }

        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var result = await _adminService.DeleteUserById(userId);

                if (result)
                    return Ok(new { Message = "User deleted successfully." });
                else
                    return BadRequest(new { Message = "Failed to delete user." });
            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }

        }

        [HttpDelete("delete-job/{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            try
            {
                var result = await _adminService.DeleteJobById(jobId);

                if (result)
                    return Ok(new { Message = "Job deleted successfully." });
                else
                    return BadRequest(new { Message = "Failed to delete job." });

            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }
            
        }
        [HttpDelete("delete-schedule/{scheduleId}")]
        public async Task<IActionResult> DeleteSchedule(int scheduleId)
        {
            try
            {
                var result = await _adminService.DeleteScheduleById(scheduleId);

                if (result)
                    return Ok(new { Message = "schedule deleted successfully." });
                else
                    return BadRequest(new { Message = "Failed to delete a schedule." });

            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }
            
        }
    }
}
