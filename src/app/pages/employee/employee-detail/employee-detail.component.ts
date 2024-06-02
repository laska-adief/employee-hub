import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Employee } from '../../../types/employee';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss',
})
export class EmployeeDetailComponent {
  employee!: Employee;
  employeeService = inject(EmployeeService);
  route = inject(ActivatedRoute);
  subs!: Subscription;
  idEmployee: string = '';
  isLoading: boolean = false;

  ngOnInit() {
    this.getParamId();
  }

  getParamId() {
    this.subs = this.route.params.subscribe({
      next: (param) => {
        if (param['id']) {
          this.idEmployee = param['id'];
          this.getEmployeeDetail();
        }
      },
    });
  }

  getEmployeeDetail() {
    this.isLoading = true;
    this.employeeService.getEmployeeDetail(this.idEmployee).subscribe({
      next: (value) => {
        if (value) {
          this.isLoading = false;
          this.employee = value;
        }
      },
      error: (error) => {
        console.log('error', error);
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
