using Application.Interfaces;
using Business.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Schedule.Controllers
{
    public class WorkerController : BaseApiController
    {
        private readonly IWorkerService _workerService;

        public WorkerController(IWorkerService workerService)
        {
            _workerService = workerService;
        }

        [HttpPost("add-schedule-request")]
        public async Task<IActionResult> AddScheduleRequest([FromBody] AddScheduleDTO scheduleDto)
        {
            try
            {
                if (await _workerService.AddScheduleRequest(scheduleDto))
                {
                    return Ok(new { Message = "Schedule request added successfully." });
                }

                return BadRequest(new { Message = "Failed to add schedule request." });

            }
            catch (Exception ex)
            {
                return NotFound($"An error occurred: {ex.Message}");
            }
            
        }
        
    }
    
}
