import { Component, inject, OnInit, AfterViewInit, signal, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats } from '../services/admin.service';
import { TranslationService } from '../services/translation.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly adminService = inject(AdminService);
  readonly translationService = inject(TranslationService);

  @ViewChild('moviesChart') moviesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reviewsChart') reviewsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersChart') usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ratingsChart') ratingsChartRef!: ElementRef<HTMLCanvasElement>;

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  activeTab = signal<'overview' | 'users' | 'reviews'>('overview');

  private charts: Chart[] = [];

  get t() {
    return this.translationService.t;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after stats are loaded
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadStats(): void {
    this.loading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        setTimeout(() => this.initCharts(), 100);
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.loading.set(false);
      }
    });
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private initCharts(): void {
    this.destroyCharts();
    const stats = this.stats();
    if (!stats) return;

    const isDark = document.documentElement.classList.contains('dark-theme');
    const textColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Movies per month chart
    if (this.moviesChartRef) {
      const ctx = this.moviesChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.charts.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: stats.moviesPerMonth.map(m => m.month),
            datasets: [{
              label: 'Movies Added',
              data: stats.moviesPerMonth.map(m => m.count),
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 1,
              borderRadius: 8
            }]
          },
          options: this.getChartOptions('Movies per Month', textColor, gridColor)
        }));
      }
    }

    // Reviews per month chart
    if (this.reviewsChartRef) {
      const ctx = this.reviewsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: stats.reviewsPerMonth.map(m => m.month),
            datasets: [{
              label: 'Reviews',
              data: stats.reviewsPerMonth.map(m => m.count),
              borderColor: 'rgb(236, 72, 153)',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(236, 72, 153)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5
            }]
          },
          options: this.getChartOptions('Reviews per Month', textColor, gridColor)
        }));
      }
    }

    // User growth chart
    if (this.usersChartRef) {
      const ctx = this.usersChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: stats.userGrowth.map(m => m.month),
            datasets: [{
              label: 'Total Users',
              data: stats.userGrowth.map(m => m.count),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(34, 197, 94)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5
            }]
          },
          options: this.getChartOptions('User Growth', textColor, gridColor)
        }));
      }
    }

    // Top rated movies (doughnut)
    if (this.ratingsChartRef && stats.topRatedMovies.length > 0) {
      const ctx = this.ratingsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.charts.push(new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: stats.topRatedMovies.map(m => m.title.substring(0, 15) + (m.title.length > 15 ? '...' : '')),
            datasets: [{
              data: stats.topRatedMovies.map(m => m.rate),
              backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(239, 68, 68, 0.8)'
              ],
              borderColor: isDark ? '#1a1a1a' : '#fff',
              borderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: textColor, font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Top Rated Movies',
                color: textColor,
                font: { size: 14, weight: 'bold' as const }
              }
            }
          }
        }));
      }
    }
  }

  private getChartOptions(title: string, textColor: string, gridColor: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: title,
          color: textColor,
          font: { size: 14, weight: 'bold' as const }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
          beginAtZero: true
        }
      }
    };
  }

  setTab(tab: 'overview' | 'users' | 'reviews'): void {
    this.activeTab.set(tab);
    if (tab === 'overview') {
      setTimeout(() => this.initCharts(), 100);
    }
  }
}
