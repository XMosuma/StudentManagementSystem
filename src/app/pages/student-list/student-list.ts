import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService, Student } from '../../services/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit {

  students: Student[] = [];

  constructor(public studentService: StudentService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        console.log('✅ Students loaded:', data);
        this.students = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.loadStudents();
    });
  }
}