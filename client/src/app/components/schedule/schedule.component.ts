import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  jobOptions: any[] = [];
  scheduleData: any[] = [];
  weekDays: Date[] = [];
  currentWeekStart: Date;

  constructor(private scheduleService: ScheduleService, private userService: UserService) {
    this.fetchJobOptions;
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.generateWeek();
    this.fetchJobOptions();
  }

  ngOnInit(): void {
    this.loadSchedule();
  }

  fetchJobOptions(): void {
    this.userService.getJobOptions().subscribe({
      next: (response) => {
        console.log('job options:', response);
        this.jobOptions = response;
      },
      error: (error) => {
        console.error('error fetching job options:', error);
      },
    });
  }

  loadSchedule() {
    this.scheduleService.getSchedules().subscribe((data: any[]) => {
      this.scheduleData = data;
    });
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateForDisplay(date: Date): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  }

  formatWeekForDisplay(): string {
        const startOfWeek = this.getStartOfWeek(new Date(this.currentWeekStart));
        const endOfWeek = this.addDays(new Date(startOfWeek), 6);

        if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
            return `${this.formatDateForDisplay(startOfWeek)} - ${this.formatDateForDisplay(endOfWeek)}`;
        } else {
            return `${this.getMonthName(startOfWeek)} ${this.getDayNumber(startOfWeek)} - ${this.getDayNumber(endOfWeek)}`;
        }
    }

    getMonthName(date: Date): string {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return monthNames[date.getMonth()];
        }
    getDayNumber(date: Date): number {
        return date.getDate();
      }
    getDayName(date: Date): string {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
      }

  generateWeek() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(this.addDays(new Date(this.currentWeekStart), i));
    }
  }

  previousWeek() {
    this.currentWeekStart = this.addDays(this.currentWeekStart, -7);
    this.generateWeek();
  }

  nextWeek() {
    this.currentWeekStart = this.addDays(this.currentWeekStart, 7);
    this.generateWeek();
  }

  determineShift(startTime: string): string {
    const startHour = new Date(startTime).getHours();

    if (startHour >= 6 && startHour < 12) return 'Morning';
    else return 'Evening';
}

  getShiftsForDateAndRole(date: Date, role: string): any[] {
    const dateStr = this.formatDate(date);
    return this.scheduleData.filter(shift => {
      const shiftStartDate = new Date(shift.startTime);
      return this.formatDate(shiftStartDate) === dateStr && shift.jobId === role;
    });
  }


}