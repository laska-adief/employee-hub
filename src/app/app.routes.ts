import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './pages/employee/employee-detail/employee-detail.component';
import { authGuard, authNotAuthorizedGuard } from './guards/auth.guard';
import { EmployeeFormComponent } from './pages/employee/employee-form/employee-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/employee/list',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [authNotAuthorizedGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: EmployeeListComponent,
      },
      {
        path: 'form',
        component: EmployeeFormComponent,
      },
      {
        path: ':id',
        component: EmployeeDetailComponent,
      },
    ],
  },
];
