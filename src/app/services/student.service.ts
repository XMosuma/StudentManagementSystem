
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // private apiUrl = '/api/students';
  private apiUrl = 'http://127.0.0.1:8000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  addStudent(student: Omit<Student, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.put(`${this.apiUrl}/${student.id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}