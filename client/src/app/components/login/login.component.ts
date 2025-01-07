import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {};

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if(this.loginForm.valid){
      const userData = this.loginForm.value;
      this.authService.loginUser(userData).subscribe({
        next:(response: any) => {
          console.log('logged in successfully: ',response);
          const jwtToken = response;
          localStorage.setItem('token', jwtToken);

          const decodedToken= this.decodeToken(jwtToken);
          const role= decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

          if(role == 1) console.log('Admin login successful');
          else if(role == 2) console.log('Worker login successful');

          if(role) this.router.navigate(['/schedule']);
          else console.log('Login failed. Please check your credentials', 'Error');
        },
        error:(error) =>{
          console.log('login failed: ', error);
        }
      })
    }
  }

  private decodeToken(token: string): any{
    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
  }
}
