import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
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
    }).subscribe((response: any) => {

      if (response.message) {
        alert('Login Successful');

        //store login state
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/students']);

      } else {
        alert('Invalid Credentials');
      }

    }, error => {
      alert('Server error');
      console.error(error);
    });
  }
}
