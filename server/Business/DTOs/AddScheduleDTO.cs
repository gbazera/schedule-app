namespace Business.DTOs;

public class AddScheduleDTO
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int UserId { get; set; }

}