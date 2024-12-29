using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Entities
{
    public class Schedule
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }


        public int UserId { get; set; }
        public int JobId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JobTitle { get; set; }

        public bool IsApproved { get; set; }

        public User User { get; set; }
        public Job Job { get; set; }
    }
}
