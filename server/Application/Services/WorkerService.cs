using Application.Interfaces;
using Business.DTOs;
using Database.Data;
using Database.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class WorkerService : IWorkerService
    {
        private readonly ScheduleContext _context;

        public WorkerService(ScheduleContext context)
        {
            _context = context;
        }

        public async Task<bool> AddScheduleRequest(AddScheduleDTO addScheduleDto)
        {
            var newUser = await _context.Users
        .Include(u => u.Job) 
        .FirstOrDefaultAsync(u => u.Id == addScheduleDto.UserId);

            if (newUser == null)
            {
                throw new NullReferenceException("User with given ID wasn't found.");
            }

            var newSchedule = new Schedule
            {
                StartTime = addScheduleDto.StartTime,
                EndTime = addScheduleDto.EndTime,
                UserId = addScheduleDto.UserId,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                JobId = newUser.JobId ?? 1,
                JobTitle = newUser.Job?.Title,
                IsApproved = false
            };

            _context.Schedules.Add(newSchedule);
            await _context.SaveChangesAsync();

            return true;

        }
        
    }
}
