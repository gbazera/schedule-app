import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  jobOptions: any[] = [];
  scheduleData: any[] = [];
  weekDays: Date[] = [];
  currentWeekStart: Date;
  scheduleForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private userService: UserService
  ) {
    this.fetchJobOptions;
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.generateWeek();
    this.fetchJobOptions();
  }

  ngOnInit(): void {
    this.loadSchedule();
    this.createNewScheduleForm();
  }

  createNewScheduleForm(): void {
    this.scheduleForm = this.fb.group({
      shiftDate: [null, Validators.required],
      shiftType: [0, Validators.required],
    });
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
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  }

  formatWeekForDisplay(): string {
    const startOfWeek = this.getStartOfWeek(new Date(this.currentWeekStart));
    const endOfWeek = this.addDays(new Date(startOfWeek), 6);

    if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
      return `${this.formatDateForDisplay(
        startOfWeek
      )} - ${this.formatDateForDisplay(endOfWeek)}`;
    } else {
      return `${this.getMonthName(startOfWeek)} ${this.getDayNumber(
        startOfWeek
      )} - ${this.getDayNumber(endOfWeek)}`;
    }
  }

  getMonthName(dateInput: Date | string): string {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
      return 'Invalid Date';
    }
    return monthNames[date.getMonth()];
  } 

  determineShift(startTime: string): string {
    const startHour = new Date(startTime).getHours();

    if (startHour >= 6 && startHour < 12) return 'Morning';
    else return 'Evening';
  }

  getDayNumber(dateInput: Date | string): number {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
      return NaN;
    }
    return date.getDate();
  }  

  getDayName(dateInput: Date | string): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateInput);
    return days[date.getDay()];
  }

  getYear(dateInput: Date | string): number {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateInput);
    return NaN;
  }
  return date.getFullYear();
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

  getShiftsForDateAndRole(date: Date, role: string): any[] {
    const dateStr = this.formatDate(date);
    return this.scheduleData.filter((shift) => {
      const shiftStartDate = new Date(shift.startTime);
      return (
        this.formatDate(shiftStartDate) === dateStr && shift.jobId === role && shift.isApproved
      );
    });
  }

  getUnapprovedShifts(): any[] {
    return this.scheduleData.filter((shift) => {
      const shiftStartDate = new Date(shift.startTime);
      return !shift.isApproved;
    });
  }

  addScheduleRequest(): void {
    if (this.scheduleForm.invalid) {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill out all fields before submitting.';
      this.successMessage = null;

      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
      return;
    }

    const startTime = new Date(this.scheduleForm.value.shiftDate);
    startTime.setUTCHours(this.scheduleForm.value.shiftType === 'morning' ? 8 : 16, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setUTCHours(startTime.getUTCHours() + 8);
    console.log('start time:', startTime.toISOString());
    console.log('end time:', endTime.toISOString());

    const scheduleRequest = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      userId: this.getUserIdFromToken(),
    };

    this.scheduleService.addScheduleRequest(scheduleRequest).subscribe({
    next: (response) => {
      console.log('Schedule request added:', response);
      this.successMessage = 'Schedule request added successfully!';
      this.errorMessage = null;
      this.loadSchedule();
      this.scheduleForm.reset();

      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    },
    error: (error) => {
      console.error('Error adding schedule request:', error);
      this.errorMessage = 'Failed to add schedule request. Please try again.';
      this.successMessage = null;

      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
  });
  }

  approveScheduleRequest(id: number): void {
    this.scheduleService.approveScheduleRequest(id).subscribe({
      next: (response) => {
        console.log('Schedule request approved:', response);
        this.successMessage = 'Schedule request approved successfully!';
        this.errorMessage = null;
        this.loadSchedule();

        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (error) => {
        console.error('Error approving schedule request:', error);
        this.errorMessage = 'Failed to approve schedule request. Please try again.';
        this.successMessage = null;

        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      },
    })
  }

  deleteSchedule(id: number): void {
    this.scheduleService.deleteSchedule(id).subscribe({
      next: (response) => {
        console.log('Schedule deleted:', response);
        this.successMessage = 'Schedule deleted successfully!';
        this.errorMessage = null;
        this.loadSchedule();

        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (error) => {
        console.error('Error deleting schedule request:', error);
        this.errorMessage = 'Failed to delete schedule request. Please try again.';
        this.successMessage = null;

        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      },
    })
  }

  getRoleFromToken(): number {
    const token = localStorage.getItem('token');
    const decodedToken = token ? this.decodeToken(token) : null;
    return decodedToken?.[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    const decodedToken = token ? this.decodeToken(token) : null;
    return decodedToken?.[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ];
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding JWT token', e);
      return null;
    }
  }
}
