import { Injectable } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private employees: Employee[] = [];
  private employeeSubject = new BehaviorSubject<Employee[]>(this.employees);

  employees$ = this.employeeSubject.asObservable();

  getEmployees() {
    return this.employees;
  }

  addEmployee(employee: Employee) {
    employee.id = crypto.randomUUID();
    this.employees.push(employee);
    this.employeeSubject.next(this.employees);
    this.saveToLocal();
  }

  updateEmployee(id: string, updated: Employee) {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = updated;
      this.employeeSubject.next(this.employees);
      this.saveToLocal();
    }
  }

  deleteEmployee(id: string) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.employeeSubject.next(this.employees);
    this.saveToLocal();
  }

  loadFromLocal() {
    const data = localStorage.getItem('employees');
    if (data) {
      this.employees = JSON.parse(data);
      this.employeeSubject.next(this.employees);
    }
  }

  private saveToLocal() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }
}
