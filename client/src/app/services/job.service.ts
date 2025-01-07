import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '../interfaces/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private userUrl = 'https://localhost:44330/api/User';
  private adminUrl = 'https://localhost:44330/api/Admin';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.userUrl}/jobs`);
  }

  addJob(req: any): Observable<any> {
    return this.http.post(`${this.adminUrl}/add-new-job`, req);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/delete-job/${id}`);
  }
}
