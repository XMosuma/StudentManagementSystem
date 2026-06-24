import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css'
})
export class StudentDetailComponent implements OnInit {

  student: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://127.0.0.1:8000/students/${id}`).subscribe({
      next: (data: any) => {
        this.student = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  deleteStudent() {
    if (confirm(`Are you sure you want to remove ${this.student.firstName}?`)) {
      this.http.delete(`http://127.0.0.1:8000/students/${this.student.id}`).subscribe({
        next: () => {
          alert('Student removed');
          this.router.navigate(['/students']);
        },
        error: (err) => console.error(err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}