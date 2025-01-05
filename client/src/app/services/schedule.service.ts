import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private userUrl = 'https://localhost:44330/api/User';
  private workerUrl = 'https://localhost:44330/api/Worker';
  private adminUrl = 'https://localhost:44330/api/Admin';

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/dashboard`);
  }

  addScheduleRequest(req: any): Observable<any> {
    console.log('scheduleRequest:', req);
    return this.http.post(`${this.workerUrl}/add-schedule-request`, req);
  }
  
  approveScheduleRequest(id: number): Observable<any> {
    return this.http.post(`${this.adminUrl}/approve-schedule-request?scheduleId=${id}`, null);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/delete-schedule/${id}`);
  }
}
