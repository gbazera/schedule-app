import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'https://localhost:44330/api/Worker';

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<any> {
    return this.http.get<any>(`https://localhost:44330/api/User/dashboard`);
  }

  addScheduleRequest(scheduleRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-schedule-request`, scheduleRequest);
  }
  
}
