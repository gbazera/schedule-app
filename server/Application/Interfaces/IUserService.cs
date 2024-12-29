using Business.DTOs;
using Database.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<User> Register(UserDTO userDto);

        Task<string> Login(LoginDTO loginDto);

        Task<List<ScheduleDTO>> GetDashboard();

        Task<List<GetJobDTO>> GetJobs();
        
        Task<List<GetUsersDTO>> GetUsers();
    }
}
