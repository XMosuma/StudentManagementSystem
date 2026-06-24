import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { StudentListComponent } from './pages/student-list/student-list';
import { StudentFormComponent } from './pages/student-form/student-form';
export const routes: Routes = [
    {
    path: '',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentListComponent
  },
  {
    path: 'add-student',
    component: StudentFormComponent
  },
  
 {
    path: 'edit-student/:id',
    component: StudentFormComponent
  }

];
