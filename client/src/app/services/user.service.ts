import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '../interfaces/job';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'https://localhost:44330/api/User';
  private adminUrl = 'https://localhost:44330/api/Admin';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/delete-user/${id}`);
  }

  changeUserRole(req: any): Observable<any> {
    return this.http.post(`${this.adminUrl}/change-user-role`, req);
  }
}
