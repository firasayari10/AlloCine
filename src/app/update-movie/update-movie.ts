import { Component, inject, OnInit } from '@angular/core';
import { Movie } from '../models/movie';
import { FormsModule } from '@angular/forms';
import { MoviesApiService } from '../services/movies-api';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-update-movie',
  imports: [FormsModule, RouterModule],
  templateUrl: './update-movie.html',
  styleUrl: './update-movie.scss',
})
export class UpdateMovie implements OnInit {
  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined, 
    image: undefined
  }
  
  rateValue: number | string | undefined = undefined;
  
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesApi.getMovieById(Number(id)).subscribe({
        next: (data: Movie) => {
          this.movie = {
            ...data,
            releaseDate: new Date(data.releaseDate)
          };
          this.rateValue = data.rate;
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  updateMovie(): void {
    let parsedRate: number | undefined = undefined;
    if (this.rateValue !== undefined && this.rateValue !== null && this.rateValue !== '') {
      const num = parseFloat(String(this.rateValue));
      if (!isNaN(num)) {
        parsedRate = num;
      }
    }
    
    const releaseDate = this.movie.releaseDate instanceof Date 
      ? this.movie.releaseDate
      : new Date(this.movie.releaseDate);
    
    const movieToUpdate: Movie = {
      id: this.movie.id,
      title: this.movie.title,
      director: this.movie.director,
      releaseDate: releaseDate,
      synopsis: this.movie.synopsis,
      rate: parsedRate,
      image: this.movie.image
    };
    
    console.log('Updating movie:', JSON.stringify(movieToUpdate));
    
    this.moviesApi.updateMovie(movieToUpdate).subscribe({
      next: () => {
        toast.success('Movie updated successfully!');
        this.router.navigate(['/movie', this.movie.id]);
      },
      error: (err) => {
        toast.error('Failed to update movie');
        console.error('Update failed:', err);
      }
    });
  }
}
