import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { StudentListComponent } from './pages/student-list/student-list';
import { StudentFormComponent } from './pages/student-form/student-form';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { StudentDetailComponent } from './pages/student-detail/student-detail';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'students', component: StudentListComponent, canActivate: [authGuard] },
  { path: 'students/:id', component: StudentDetailComponent, canActivate: [authGuard] },
  { path: 'add-student', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'edit-student/:id', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
];