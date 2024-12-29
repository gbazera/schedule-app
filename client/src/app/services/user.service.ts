import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '../interfaces/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44330/api/User';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  registerUser(userData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginUser(userData: any): Observable<any>{
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${this.apiUrl}/login`, userData, {headers, responseType: 'text' as 'json'});
  }
  
  logoutUser(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
