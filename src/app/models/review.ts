import { User } from './user';
import { Movie } from './movie';

export interface Review {
  id?: number;
  user: User;
  movie?: Movie;
  film?: Movie;  // Backend might use 'film' instead of 'movie'
  rate: number;
  text: string;
  reviewDate: string;
}
