import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
    }).subscribe((response: any) => {

      if (response.message) {
        alert('Login Successful ✅');

        // ✅ store login state
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/students']);

      } else {
        alert('Invalid Credentials ❌');
      }

    }, error => {
      alert('Server error ❌');
      console.error(error);
    });
  }
}
