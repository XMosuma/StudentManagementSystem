import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const role = localStorage.getItem('role');

  if (!isLoggedIn) {
    router.navigate(['/']);
    return false;
  }

  //students can't access admin pages
  if (role === 'student' && state.url.includes('/students')) {
    router.navigate(['/dashboard']);
    return false;
  }

  //admins can't access student dashboard
  if (role === 'admin' && state.url.includes('/dashboard')) {
    router.navigate(['/students']);
    return false;
  }

  return true;
};