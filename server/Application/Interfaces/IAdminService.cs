using Business.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IAdminService
    {
        Task<bool> ApproveScheduleRequest(int scheduleId);
        Task<bool> ChangeUserRole(int userId, int newRoleId);
        Task<bool> AddNewJob(JobDTO jobDto);

        Task<bool> DeleteUserById(int userId);
        Task<bool> DeleteJobById(int jobId);

        Task<bool> DeleteScheduleById(int Id);

    }
}
