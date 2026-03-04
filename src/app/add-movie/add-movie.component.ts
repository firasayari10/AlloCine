import { Component , inject} from '@angular/core';
import { Movie } from '../models/movie';
import { FormsModule } from '@angular/forms';
import { MoviesApiService } from '../services/movies-api';
import { TranslationService } from '../services/translation.service';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-movie',
  imports: [FormsModule, RouterModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss',
})
export class AddMovieComponent {
  readonly translationService = inject(TranslationService);
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);

  get t() {
    return this.translationService.t;
  }

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined, 
    image: undefined
  }

  addMovie(): void {
    const releaseDate = this.movie.releaseDate instanceof Date 
      ? this.movie.releaseDate.toISOString().split('T')[0]
      : this.movie.releaseDate;
    
    const movieToAdd = {
      title: this.movie.title,
      director: this.movie.director,
      releaseDate: new Date(releaseDate),
      synopsis: this.movie.synopsis,
      rate: this.movie.rate ? Number(this.movie.rate) : undefined,
      image: this.movie.image
    };
    
    console.log('Adding movie:', JSON.stringify(movieToAdd));
    
    this.moviesApi.addMovie(movieToAdd).subscribe({
      next: () => {
        toast.success('Movie added successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        toast.error('Failed to add movie');
        console.error('Add failed:', err);
      }
    });
  }
}
