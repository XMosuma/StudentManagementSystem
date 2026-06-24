import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  showNavbar = false;
  hiddenRoutes = ['/', '/register'];
  role = localStorage.getItem('role');

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.showNavbar = !this.hiddenRoutes.includes(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      this.role = localStorage.getItem('role'); //refresh role on navigation
      this.cdr.detectChanges();
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}