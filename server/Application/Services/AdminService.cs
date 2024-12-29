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
    public class AdminService : IAdminService
    {
        private readonly ScheduleContext _context;

        public AdminService(ScheduleContext context)
        {
            _context = context;
        }

        public async Task<bool> ApproveScheduleRequest(int scheduleId)
        {
            var schedule = await _context.Schedules.FindAsync(scheduleId);

            if (schedule == null)
            {
                throw new NullReferenceException("Schedule with given ID was not found");
            }
                

            schedule.IsApproved = true;
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<bool> ChangeUserRole(int userId, int newRoleId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new NullReferenceException("User with given ID was not found");
            }

            user.RoleId = newRoleId;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AddNewJob(JobDTO jobDto)
        {
            var existingJob = await _context.Jobs.FirstOrDefaultAsync(j => j.Title == jobDto.Title);

            if (existingJob != null)
            {
                throw new ArgumentException("Job with this title already exists.");
            }

            var newJob = new Job
            {
                Title = jobDto.Title
            };

            _context.Jobs.Add(newJob);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteUserById(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new NullReferenceException("User with given ID was not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteJobById(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);

            if (job == null)
            {
                throw new NullReferenceException("Job with given ID was not found");
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteScheduleById(int scheduleId)
        {
            var schedule = await _context.Schedules.FindAsync(scheduleId);

            if (schedule == null)
            {
                throw new NullReferenceException("Schedule with given ID was not found");
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
