import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-card',
  standalone: true, 
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({required: true}) movie!: Movie;
}
