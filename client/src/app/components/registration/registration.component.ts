import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../validators/passwordMatch.Validator';
import { Job } from 'src/app/interfaces/job';
import { JobService } from 'src/app/services/job.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  jobOptions: Job[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('registration component initialized');
    this.fetchJobOptions;
    this.createForm();
    this.fetchJobOptions();
  }

  createForm(): void {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        jobId: [null, Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  register(): void {
    if (this.registrationForm.valid) {
      const { confirmPassword, jobId, ...userData } =
        this.registrationForm.value;

      this.authService.registerUser({ ...userData, jobId }).subscribe({
        next: (response: any) => {
          console.log('registration successful: ', response);
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.log('error: ', error);
        },
      });
    }
  }

  fetchJobOptions(): void {
    this.jobService.getJobs().subscribe({
      next: (response) => {
        console.log('job options:', response);
        this.jobOptions = response;
      },
      error: (error) => {
        console.error('error fetching job options:', error);
      },
    });
  }
}
