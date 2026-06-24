import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    this.http.post('http://127.0.0.1:8000/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.error) {
          alert(response.error); //shows deactivated message
          return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', response.role);
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('username', response.username);

        //redirect based on role
        if (response.role === 'admin') {
          this.router.navigate(['/students']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        alert('Server error');
        console.error(err);
      }
    });
  }
}