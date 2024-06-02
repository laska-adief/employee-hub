import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EmployeeService } from '../../../services/employee.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatAutocompleteModule,
    RouterModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  fb = inject(FormBuilder);
  employeeService = inject(EmployeeService);
  employeeForm!: FormGroup;

  groupList = [
    'group 1',
    'group 2',
    'group 3',
    'group 4',
    'group 5',
    'group 6',
    'group 7',
    'group 8',
    'group 9',
    'group 10',
  ];
  fiteredGroupList!: Observable<string[]> | undefined;

  maxDate = new Date();
  _snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.initForm();

    this.fiteredGroupList = this.employeeForm.get('group')?.valueChanges.pipe(
      startWith(''),
      map((value: string) =>
        this.groupList.filter((option: string) =>
          option.toLowerCase().includes(value)
        )
      )
    );
  }

  initForm() {
    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  submitForm() {
    this.addEmployee();
  }

  addEmployee() {
    this.employeeService.addEmployee(this.employeeForm.value).subscribe({
      next: (value) => {
        if (value) {
          this.employeeForm.reset();
          this.employeeForm.markAsUntouched();
          this.employeeForm.markAsPristine();

          this._snackBar.open('Data Added', 'OK', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        }
      },
      error: (error) => {
        console.log('error', error);
      },
    });
  }
}
