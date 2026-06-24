import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  register() {
    if (!this.username || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.http.post('http://127.0.0.1:8000/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (_response: any) => {
        alert('Registration Successful Please login');
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Registration failed');
        console.error(err);
      }
    });
  }
}