import { Component, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Employee } from '../../../types/employee';
import { EmployeeService } from '../../../services/employee.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    // 'status',
    // 'group',
    'action',
  ];
  displayedFilterColumns: string[] = [
    'firstnameFilter',
    'lastnameFilter',
    'emailFilter',
    // 'statusFilter',
    // 'groupFilter',
    'actionFilter',
  ];

  firstNameFilter: FormControl = new FormControl('');
  lastNameFilter: FormControl = new FormControl('');
  emailFilter: FormControl = new FormControl('');

  employee: Employee[] = [];
  employeeCount: number = 0;
  isLoading: boolean = false;

  filteredValues = {
    firstName: '',
    lastName: '',
    email: '',
  };

  employeeService = inject(EmployeeService);
  router = inject(Router);
  _snackBar = inject(MatSnackBar);
  subs!: Subscription;

  ngOnInit() {
    this.initFilter();
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.getEmployee();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initFilter() {
    this.subs = this.firstNameFilter.valueChanges.subscribe({
      next: (value) => {
        this.filteredValues.firstName = value.trim().toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      },
    });

    this.subs = this.lastNameFilter.valueChanges.subscribe({
      next: (value) => {
        this.filteredValues.lastName = value.trim().toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      },
    });

    this.subs = this.emailFilter.valueChanges.subscribe({
      next: (value) => {
        this.filteredValues.email = value.trim().toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      },
    });

    const lastFilter: any = this.employeeService.getLastFilter();
    if (lastFilter?.firstName || lastFilter?.lastName || lastFilter?.email) {
      this.firstNameFilter.setValue(lastFilter?.firstName);
      this.lastNameFilter.setValue(lastFilter?.lastName);
      this.emailFilter.setValue(lastFilter?.email);
    }
  }

  customFilterPredicate() {
    return (data: any, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      const valueFilterFirstname =
        data.firstName
          .toString()
          .toLowerCase()
          .indexOf(searchString.firstName) !== -1;

      const valueFilterLastName =
        data.lastName
          .toString()
          .toLowerCase()
          .indexOf(searchString.lastName) !== -1;

      const valueFilterEmail =
        data.email.toString().toLowerCase().indexOf(searchString.email) !== -1;

      return valueFilterFirstname && valueFilterLastName && valueFilterEmail;
    };
  }

  getEmployee() {
    this.isLoading = true;
    this.subs = this.employeeService.getEmployees().subscribe({
      next: (value: Employee[]) => {
        if (value.length) {
          this.isLoading = false;
          this.employee = value;
          this.dataSource.data = this.employee;
          this.employeeCount = this.employee?.length;
        } else {
          this.isLoading = false;
          this.employee = [];
          this.dataSource.data = [];
          this.employeeCount = 0;
        }
      },
      error: (error) => {
        console.log('error', error);
        this.isLoading = false;
      },
    });
  }

  addEmployee() {
    this.employeeService.setLastFilter(null);
    this.router.navigate(['/employee/form']);
  }

  detailEmployee(id: string) {
    this.employeeService.setLastFilter(this.filteredValues);
    this.router.navigate(['/employee/', id]);
  }

  editEmployee() {
    this._snackBar.open('Data Updated', 'OK', {
      duration: 30000000000000000,
      panelClass: ['yellow-snackbar'],
    });
  }

  deleteEmployee() {
    this._snackBar.open('Data Deleted', 'OK', {
      duration: 3000,
      panelClass: ['red-snackbar'],
    });
  }

  resetButton() {
    this.firstNameFilter.setValue('', { emitEvent: false });
    this.lastNameFilter.setValue('', { emitEvent: false });
    this.emailFilter.setValue('', { emitEvent: false });
    this.employeeService.setLastFilter(null);
    this.filteredValues = {
      firstName: '',
      lastName: '',
      email: '',
    };
    this.dataSource.filter = JSON.stringify(this.filteredValues);
    this.sort.direction = '';
    this.sort.active = '';
    this.paginator.pageSize = 10;
    this.getEmployee();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
