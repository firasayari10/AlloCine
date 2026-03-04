import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { MoviesApiService } from '../services/movies-api'; 
import { TranslationService } from '../services/translation.service';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.html',
  styleUrls: ['./movies-list.scss'],   
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule]
})
export class MoviesListComponent implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  readonly translationService = inject(TranslationService);

  get t() {
    return this.translationService.t;
  }

  movies = signal<Movie[]>([]); 
  
  searchQuery = signal('');
  sortField = signal<'title' | 'releaseDate' | 'rate' | 'director'>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  currentPage = signal(1);
  itemsPerPage = signal(10);
  
  filteredMovies = computed(() => {
    let result = [...this.movies()];
    
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.synopsis?.toLowerCase().includes(query)
      );
    }
    
    const field = this.sortField();
    const direction = this.sortDirection();
    result.sort((a, b) => {
      let comparison = 0;
      
      if (field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (field === 'director') {
        comparison = a.director.localeCompare(b.director);
      } else if (field === 'releaseDate') {
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      } else if (field === 'rate') {
        comparison = (a.rate || 0) - (b.rate || 0);
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  });
  
  paginatedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredMovies().slice(start, end);
  });
  
  totalPages = computed(() => {
    return Math.ceil(this.filteredMovies().length / this.itemsPerPage());
  });
  
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  ngOnInit(): void {
    this.loadMovies();
  }
  
  loadMovies(): void {
    this.moviesApi.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies.set(data.map(m => ({
          ...m,
          releaseDate: new Date(m.releaseDate)   
        })));
      },
      error: (err: any) => console.error(err)
    });
  }

  formatDate(date: Date): string {  
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  deleteMovie(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this movie?')) {
      this.moviesApi.deleteMovie(id).subscribe({
        next: () => {
          this.movies.update(current => current.filter(m => m.id !== id));
          toast.success('Movie deleted successfully!');
        },
        error: (err: any) => {
          toast.error('Failed to delete movie');
          console.error(err);
        }
      });
    }
  }
  
  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }
  
  toggleSort(field: 'title' | 'releaseDate' | 'rate' | 'director'): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }
  
  getSortIcon(field: string): string {
    if (this.sortField() !== field) return '';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
  
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
  
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  
  getEndIndex(): number {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.filteredMovies().length);
  }
}
