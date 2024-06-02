import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Employee } from '../types/employee';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  http = inject(HttpClient);
  readonly BASEURL = 'http://localhost:3000/employees';
  lastFilter$ = new BehaviorSubject({});

  constructor() {}

  getEmployees() {
    return this.http.get<Employee[]>(this.BASEURL);
  }

  getEmployeeDetail(id: string) {
    return this.http.get<Employee>(this.BASEURL + '/' + id);
  }

  addEmployee(data: Employee) {
    return this.http.post<Employee>(this.BASEURL, data);
  }

  setLastFilter(filter: any) {
    this.lastFilter$.next(filter);
  }

  getLastFilter() {
    return this.lastFilter$.getValue();
  }
}
