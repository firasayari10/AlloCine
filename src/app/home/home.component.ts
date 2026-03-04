import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoviesApiService } from '../services/movies-api';
import { TmdbService } from '../services/tmdb.service';
import { TranslationService } from '../services/translation.service';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { TmdbMovie } from '../models/tmdb-movie';
import { MovieCard } from './movie-card/movie-card';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-home',
  standalone: true,             
  imports: [CommonModule, AsyncPipe, DatePipe, MovieCard, RouterModule, FormsModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly tmdbService = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);
  readonly translationService = inject(TranslationService);

  get t() {
    return this.translationService.t;
  }
  
  movies$: Observable<Movie[]> = this.moviesApi.getMovies();
  
  // Carousel state
  carouselMovies = signal<TmdbMovie[]>([]);
  currentSlide = signal(0);
  carouselLoading = signal(true);
  private carouselInterval: any;
  
  tmdbMovies = signal<TmdbMovie[]>([]);
  tmdbCategory = signal<'popular' | 'top_rated' | 'now_playing' | 'upcoming'>('popular');
  tmdbSearchQuery = signal('');
  tmdbLoading = signal(false);
  addingMovieId = signal<number | null>(null);
  addedMovieIds = signal<Set<number>>(new Set());

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category && ['popular', 'top_rated', 'now_playing', 'upcoming'].includes(category)) {
        this.tmdbCategory.set(category as 'popular' | 'top_rated' | 'now_playing' | 'upcoming');
        this.loadTmdbMovies();
      }
    });
    
    this.loadTmdbMovies();
    this.loadCarouselMovies();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  loadCarouselMovies() {
    this.carouselLoading.set(true);
    console.log('Loading carousel movies...');
    this.tmdbService.getNowPlayingMovies().subscribe({
      next: (response) => {
        console.log('TMDB response:', response);
        // Get top 5 movies with backdrop images for carousel
        const moviesWithBackdrop = response.results
          .filter(m => m.backdrop_path)
          .slice(0, 5);
        console.log('Carousel movies:', moviesWithBackdrop);
        this.carouselMovies.set(moviesWithBackdrop);
        this.carouselLoading.set(false);
        this.startCarousel();
      },
      error: (err) => {
        console.error('Failed to load carousel movies:', err);
        this.carouselLoading.set(false);
      }
    });
  }

  startCarousel() {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => {
      const movies = this.carouselMovies();
      if (movies.length > 0) {
        this.currentSlide.set((this.currentSlide() + 1) % movies.length);
      }
    }, 5000); // Change slide every 5 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    this.startCarousel(); // Reset timer when manually changing
  }

  getBackdropUrl(backdropPath: string | null): string {
    if (!backdropPath) return '';
    return `https://image.tmdb.org/t/p/original${backdropPath}`;
  }

  scrollToMovies() {
    const element = document.getElementById('movies-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToExplore() {
    const element = document.getElementById('explore-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  loadTmdbMovies() {
    this.tmdbLoading.set(true);
    
    let request$;
    switch (this.tmdbCategory()) {
      case 'top_rated':
        request$ = this.tmdbService.getTopRatedMovies();
        break;
      case 'now_playing':
        request$ = this.tmdbService.getNowPlayingMovies();
        break;
      case 'upcoming':
        request$ = this.tmdbService.getUpcomingMovies();
        break;
      default:
        request$ = this.tmdbService.getPopularMovies();
    }

    request$.subscribe({
      next: (response) => {
        this.tmdbMovies.set(response.results);
        this.tmdbLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load TMDB movies:', err);
        this.tmdbLoading.set(false);
      }
    });
  }

  searchTmdbMovies() {
    const query = this.tmdbSearchQuery().trim();
    if (!query) {
      this.loadTmdbMovies();
      return;
    }

    this.tmdbLoading.set(true);
    this.tmdbService.searchMovies(query).subscribe({
      next: (response) => {
        this.tmdbMovies.set(response.results);
        this.tmdbLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.tmdbLoading.set(false);
      }
    });
  }

  changeCategory(category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming') {
    this.tmdbCategory.set(category);
    this.tmdbSearchQuery.set('');
    this.loadTmdbMovies();
  }

  getPosterUrl(posterPath: string | null): string {
    return this.tmdbService.getPosterUrl(posterPath);
  }

  addToCollection(tmdbMovie: TmdbMovie) {
    this.addingMovieId.set(tmdbMovie.id);

    this.tmdbService.getMovieDetails(tmdbMovie.id).subscribe({
      next: (details) => {
        const director = details.credits?.crew.find(c => c.job === 'Director')?.name || '';
        
        const movie: Movie = {
          title: tmdbMovie.title,
          director: director,
          releaseDate: new Date(tmdbMovie.release_date),
          synopsis: tmdbMovie.overview,
          rate: Math.round(tmdbMovie.vote_average * 10) / 10,
          image: tmdbMovie.poster_path ? this.getPosterUrl(tmdbMovie.poster_path) : undefined
        };

        this.moviesApi.addMovie(movie).subscribe({
          next: () => {
            this.addingMovieId.set(null);
            this.addedMovieIds.update(set => new Set([...set, tmdbMovie.id]));
            this.movies$ = this.moviesApi.getMovies();
            toast.success(`"${tmdbMovie.title}" added to collection!`);
          },
          error: (err) => {
            console.error('Failed to add movie:', err);
            this.addingMovieId.set(null);
            toast.error('Failed to add movie');
          }
        });
      },
      error: (err) => {
        console.error('Failed to get movie details:', err);
        this.addingMovieId.set(null);
      }
    });
  }

  isMovieAdded(movieId: number): boolean {
    return this.addedMovieIds().has(movieId);
  }

  isAddingMovie(movieId: number): boolean {
    return this.addingMovieId() === movieId;
  }
}
