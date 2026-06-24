import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css'
})
export class StudentDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;

  student: any = null;
  budget: any = null;
  activeTab = 'info'; // info | budget
  currentMonth = new Date().toISOString().slice(0, 7);
  pieChart: any = null;
  lineChart: any = null;

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
        // ✅ load budget using user_id
        if (data.user_id) {
          this.loadBudget(data.user_id);
        }
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit() {}

  loadBudget(userId: number) {
    this.http.get(`http://127.0.0.1:8000/admin/budget/${userId}?month=${this.currentMonth}`).subscribe({
      next: (data: any) => {
        this.budget = data;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.initCharts();
          this.updateCharts();
        }, 100);
      },
      error: (err) => console.error(err)
    });
  }

  initCharts() {
    if (this.pieChartRef && !this.pieChart) {
      this.pieChart = new Chart(this.pieChartRef.nativeElement, {
        type: 'pie',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }
    if (this.lineChartRef && !this.lineChart) {
      this.lineChart = new Chart(this.lineChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Monthly Spending',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
    }
  }

  updateCharts() {
    if (!this.budget) return;
    const colors = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#8b5cf6','#06b6d4','#f97316','#ec4899'];
    const activeBreakdown = this.budget.breakdown.filter((b: any) => b.spent > 0);

    if (this.pieChart) {
      this.pieChart.data.labels = activeBreakdown.map((b: any) => b.name);
      this.pieChart.data.datasets[0].data = activeBreakdown.map((b: any) => b.spent);
      this.pieChart.data.datasets[0].backgroundColor = colors.slice(0, activeBreakdown.length);
      this.pieChart.update();
    }

    if (this.lineChart && this.budget.history) {
      this.lineChart.data.labels = this.budget.history.map((h: any) => h.month);
      this.lineChart.data.datasets[0].data = this.budget.history.map((h: any) => h.spent);
      this.lineChart.update();
    }
  }

  deleteStudent() {
    if (confirm(`Are you sure you want to remove ${this.student.firstName}?`)) {
      this.http.delete(`http://127.0.0.1:8000/students/${this.student.id}`).subscribe({
        next: () => {
          alert('Student removed ✅');
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