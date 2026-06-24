import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css'
})
export class StudentFormComponent implements OnInit {

  student: Student = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    age: 0
  };

  isEdit = false;

  constructor(
  private studentService: StudentService,
  private router: Router,
  private route: ActivatedRoute,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.studentService.getStudentById(Number(idParam)).subscribe(student => {
        this.student = student;
      });
    }
  }
}

  saveStudent(form: any) {
    if (form.invalid) {
      alert('Please fix all errors before submitting');
      return;
    }

    if (this.isEdit) {
      this.studentService.updateStudent(this.student).subscribe(() => {
        alert('Student Updated Successfully');
        this.router.navigate(['/students']);
      });
    } else {
      // ✅ Strip id — let the database auto-generate it
      const { id, ...studentWithoutId } = this.student;

      this.studentService.addStudent(studentWithoutId).subscribe(() => {
        alert('Student Added Successfully');
        this.router.navigate(['/students']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}