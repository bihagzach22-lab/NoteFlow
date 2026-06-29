import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.errorMessage = 'Invalid verification link.';
      return;
    }

    this.http.get<{ message: string }>(
      `${environment.apiUrl}/auth/confirm-email?token=${encodeURIComponent(token)}`
    ).subscribe({
      next: response => {
        this.loading = false;
        this.successMessage = response.message;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Unable to verify email.';
      }
    });
  }
}