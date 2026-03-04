export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetails extends TmdbMovie {
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  homepage: string;
  status: string;
  credits?: {
    crew: { job: string; name: string }[];
  };
}
