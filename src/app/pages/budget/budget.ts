import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class BudgetComponent implements OnInit, AfterViewInit {

  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;

  userId = Number(localStorage.getItem('user_id'));
  currentMonth = new Date().toISOString().slice(0, 7);

  stipend = 7000;
  overview: any = null;
  categories: any[] = [];
  expenses: any[] = [];

  // Add expense form
  showAddExpense = false;
  newExpense = {
    category_id: 0,
    category_name: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().slice(0, 10),
    month: new Date().toISOString().slice(0, 7)
  };

  // Add category form
  showAddCategory = false;
  newCategory = { name: '', limit: 0 };

  // Edit limit
  editingCategoryId: number | null = null;
  editLimit = 0;

  pieChart: any = null;
  lineChart: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  ngAfterViewInit() {
    // this.initCharts();
  }

  loadAll() {
    this.loadStipend();
    this.loadCategories();
    this.loadExpenses();
    this.loadOverview();
  }

  loadStipend() {
    this.http.get(`http://127.0.0.1:8000/stipend/${this.userId}`).subscribe({
      next: (data: any) => {
        this.stipend = data.amount;
        this.cdr.detectChanges();
      }
    });
  }

  updateStipend() {
    this.http.put(`http://127.0.0.1:8000/stipend/${this.userId}`, {
      amount: this.stipend,
      month: this.currentMonth
    }).subscribe({
      next: () => {
        alert('Stipend updated ✅');
        this.loadOverview();
      }
    });
  }

  loadCategories() {
    this.http.get(`http://127.0.0.1:8000/budget/categories/${this.userId}`).subscribe({
      next: (data: any) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  addCategory() {
    if (!this.newCategory.name.trim()) return;
    this.http.post('http://127.0.0.1:8000/budget/categories', {
      user_id: this.userId,
      name: this.newCategory.name,
      limit: this.newCategory.limit,
      is_default: false
    }).subscribe({
      next: () => {
        this.newCategory = { name: '', limit: 0 };
        this.showAddCategory = false;
        this.loadCategories();
        this.loadOverview();
      }
    });
  }

  updateLimit(categoryId: number) {
    this.http.put(`http://127.0.0.1:8000/budget/categories/${categoryId}?limit=${this.editLimit}`, {}).subscribe({
      next: () => {
        this.editingCategoryId = null;
        this.loadCategories();
        this.loadOverview();
      }
    });
  }

  deleteCategory(categoryId: number) {
    if (confirm('Delete this category?')) {
      this.http.delete(`http://127.0.0.1:8000/budget/categories/${categoryId}`).subscribe({
        next: () => {
          this.loadCategories();
          this.loadOverview();
        },
        error: (err) => alert('Cannot delete default category')
      });
    }
  }

  loadExpenses() {
    this.http.get(`http://127.0.0.1:8000/expenses/${this.userId}?month=${this.currentMonth}`).subscribe({
      next: (data: any) => {
        this.expenses = data;
        this.cdr.detectChanges();
      }
    });
  }

  addExpense() {
    if (!this.newExpense.category_id || !this.newExpense.amount) {
      alert('Please fill in category and amount');
      return;
    }
    const cat = this.categories.find(c => c.id == this.newExpense.category_id);
    this.newExpense.category_name = cat ? cat.name : '';
    this.newExpense.month = this.currentMonth;

    this.http.post('http://127.0.0.1:8000/expenses', {
      ...this.newExpense,
      user_id: this.userId
    }).subscribe({
      next: () => {
        this.newExpense = {
          category_id: 0,
          category_name: '',
          amount: 0,
          description: '',
          date: new Date().toISOString().slice(0, 10),
          month: this.currentMonth
        };
        this.showAddExpense = false;
        this.loadExpenses();
        this.loadOverview();
      }
    });
  }

  deleteExpense(expenseId: number) {
    if (confirm('Delete this expense?')) {
      this.http.delete(`http://127.0.0.1:8000/expenses/${expenseId}`).subscribe({
        next: () => {
          this.loadExpenses();
          this.loadOverview();
        }
      });
    }
  }

  loadOverview() {
  this.http.get(`http://127.0.0.1:8000/budget/overview/${this.userId}?month=${this.currentMonth}`).subscribe({
    next: (data: any) => {
      this.overview = data;
      this.cdr.detectChanges();
      //init charts after view updates
      setTimeout(() => {
        if (!this.pieChart && !this.lineChart) {
          this.initCharts();
        }
        this.updateCharts();
      }, 100);
    }
  });
}

  getProgressPercent(spent: number, limit: number): number {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  }

  initCharts() {
    if (this.pieChartRef) {
      this.pieChart = new Chart(this.pieChartRef.nativeElement, {
        type: 'pie',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }
    if (this.lineChartRef) {
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
    if (!this.overview) return;

    // Pie chart — spending by category
    const colors = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#8b5cf6','#06b6d4','#f97316','#ec4899'];
    const activeBreakdown = this.overview.breakdown.filter((b: any) => b.spent > 0);

    if (this.pieChart) {
      this.pieChart.data.labels = activeBreakdown.map((b: any) => b.name);
      this.pieChart.data.datasets[0].data = activeBreakdown.map((b: any) => b.spent);
      this.pieChart.data.datasets[0].backgroundColor = colors.slice(0, activeBreakdown.length);
      this.pieChart.update();
    }

    // Line chart — monthly history
    if (this.lineChart && this.overview.history) {
      this.lineChart.data.labels = this.overview.history.map((h: any) => h.month);
      this.lineChart.data.datasets[0].data = this.overview.history.map((h: any) => h.spent);
      this.lineChart.update();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}