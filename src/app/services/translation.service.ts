import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'fr';

export interface Translations {
  // Navigation
  home: string;
  movies: string;
  myReviews: string;
  addMovie: string;
  profile: string;
  menu: string;
  
  // Auth
  signIn: string;
  signUp: string;
  logout: string;
  login: string;
  register: string;
  forgotPassword: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  resetPassword: string;
  sendResetLink: string;
  backToLogin: string;
  
  // Home
  cinemaCollection: string;
  discoverMovies: string;
  browseCollection: string;
  searchPlaceholder: string;
  trending: string;
  popular: string;
  topRated: string;
  upcoming: string;
  nowPlaying: string;
  exploreByCategory: string;
  yourMovies: string;
  films: string;
  noMoviesYet: string;
  startBuilding: string;
  exploreTmdb: string;
  exploreMovies: string;
  discoverTmdb: string;
  addToCollection: string;
  
  // Movies
  allMovies: string;
  noMoviesFound: string;
  director: string;
  releaseDate: string;
  synopsis: string;
  rating: string;
  editMovie: string;
  deleteMovie: string;
  confirmDelete: string;
  sortBy: string;
  title: string;
  
  // Reviews
  reviews: string;
  writeReview: string;
  editYourReview: string;
  yourRating: string;
  yourReview: string;
  submitReview: string;
  updateReview: string;
  cancel: string;
  noReviewsYet: string;
  beFirstToReview: string;
  reviewSubmitted: string;
  reviewUpdated: string;
  reviewDeleted: string;
  edit: string;
  delete: string;
  
  // My Reviews
  myReviewsTitle: string;
  yourMovieReviews: string;
  noReviewsMessage: string;
  browseMovies: string;
  
  // Add/Edit Movie
  addNewMovie: string;
  editMovieTitle: string;
  movieTitle: string;
  movieDirector: string;
  movieReleaseDate: string;
  movieSynopsis: string;
  movieRating: string;
  movieImage: string;
  saveMovie: string;
  movieAdded: string;
  movieUpdated: string;
  
  // Profile
  myProfile: string;
  accountSettings: string;
  updateProfile: string;
  profileUpdated: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  back: string;
  save: string;
  close: string;
  search: string;
  clear: string;
  viewDetails: string;
  seeAll: string;
  
  // Sidebar categories
  explore: string;
  account: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home',
    movies: 'Movies',
    myReviews: 'My Reviews',
    addMovie: 'Add Movie',
    profile: 'Profile',
    menu: 'Menu',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    rememberMe: 'Remember me',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    
    // Home
    cinemaCollection: 'Cinema Collection',
    discoverMovies: 'Discover and curate your personal film library.',
    browseCollection: 'Browse Collection',
    searchPlaceholder: 'Search movies...',
    trending: 'Trending',
    popular: 'Popular',
    topRated: 'Top Rated',
    upcoming: 'Upcoming',
    nowPlaying: 'Now Playing',
    exploreByCategory: 'Explore by Category',
    yourMovies: 'Your Movies',
    films: 'films',
    noMoviesYet: 'No movies yet',
    startBuilding: 'Start building your collection.',
    exploreTmdb: 'Explore TMDB',
    exploreMovies: 'Explore Movies',
    discoverTmdb: 'Discover movies from The Movie Database',
    addToCollection: 'Add to Collection',
    
    // Movies
    allMovies: 'All Movies',
    noMoviesFound: 'No movies found',
    director: 'Director',
    releaseDate: 'Release Date',
    synopsis: 'Synopsis',
    rating: 'Rating',
    editMovie: 'Edit Movie',
    deleteMovie: 'Delete Movie',
    confirmDelete: 'Are you sure you want to delete this movie?',
    sortBy: 'Sort by',
    title: 'Title',
    
    // Reviews
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    editYourReview: 'Edit Your Review',
    yourRating: 'Your Rating',
    yourReview: 'Your Review',
    submitReview: 'Submit Review',
    updateReview: 'Update Review',
    cancel: 'Cancel',
    noReviewsYet: 'No reviews yet',
    beFirstToReview: 'Be the first to review this movie!',
    reviewSubmitted: 'Review submitted!',
    reviewUpdated: 'Review updated!',
    reviewDeleted: 'Review deleted',
    edit: 'Edit',
    delete: 'Delete',
    
    // My Reviews
    myReviewsTitle: 'My Reviews',
    yourMovieReviews: 'Your movie reviews and ratings',
    noReviewsMessage: "You haven't reviewed any movies yet. Start watching and share your thoughts!",
    browseMovies: 'Browse Movies',
    
    // Add/Edit Movie
    addNewMovie: 'Add New Movie',
    editMovieTitle: 'Edit Movie',
    movieTitle: 'Title',
    movieDirector: 'Director',
    movieReleaseDate: 'Release Date',
    movieSynopsis: 'Synopsis',
    movieRating: 'Rating',
    movieImage: 'Image URL',
    saveMovie: 'Save Movie',
    movieAdded: 'Movie added successfully!',
    movieUpdated: 'Movie updated successfully!',
    
    // Profile
    myProfile: 'My Profile',
    accountSettings: 'Account Settings',
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile updated!',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    back: 'Back',
    save: 'Save',
    close: 'Close',
    search: 'Search',
    clear: 'Clear',
    viewDetails: 'View Details',
    seeAll: 'See All',
    
    // Sidebar
    explore: 'Explore',
    account: 'Account',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    movies: 'Films',
    myReviews: 'Mes Avis',
    addMovie: 'Ajouter un Film',
    profile: 'Profil',
    menu: 'Menu',
    
    // Auth
    signIn: 'Connexion',
    signUp: 'Inscription',
    logout: 'Déconnexion',
    login: 'Se connecter',
    register: "S'inscrire",
    forgotPassword: 'Mot de passe oublié ?',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    rememberMe: 'Se souvenir de moi',
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    resetPassword: 'Réinitialiser le mot de passe',
    sendResetLink: 'Envoyer le lien',
    backToLogin: 'Retour à la connexion',
    
    // Home
    cinemaCollection: 'Collection Cinéma',
    discoverMovies: 'Découvrez et organisez votre bibliothèque de films personnelle.',
    browseCollection: 'Parcourir la Collection',
    searchPlaceholder: 'Rechercher des films...',
    trending: 'Tendances',
    popular: 'Populaires',
    topRated: 'Mieux Notés',
    upcoming: 'À Venir',
    nowPlaying: 'En Salle',
    exploreByCategory: 'Explorer par Catégorie',
    yourMovies: 'Vos Films',
    films: 'films',
    noMoviesYet: 'Pas encore de films',
    startBuilding: 'Commencez à construire votre collection.',
    exploreTmdb: 'Explorer TMDB',
    exploreMovies: 'Explorer les Films',
    discoverTmdb: 'Découvrez des films de The Movie Database',
    addToCollection: 'Ajouter à la Collection',
    
    // Movies
    allMovies: 'Tous les Films',
    noMoviesFound: 'Aucun film trouvé',
    director: 'Réalisateur',
    releaseDate: 'Date de sortie',
    synopsis: 'Synopsis',
    rating: 'Note',
    editMovie: 'Modifier le Film',
    deleteMovie: 'Supprimer le Film',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce film ?',
    sortBy: 'Trier par',
    title: 'Titre',
    
    // Reviews
    reviews: 'Avis',
    writeReview: 'Écrire un Avis',
    editYourReview: 'Modifier Votre Avis',
    yourRating: 'Votre Note',
    yourReview: 'Votre Avis',
    submitReview: 'Soumettre',
    updateReview: 'Mettre à jour',
    cancel: 'Annuler',
    noReviewsYet: 'Aucun avis pour le moment',
    beFirstToReview: 'Soyez le premier à donner votre avis !',
    reviewSubmitted: 'Avis soumis !',
    reviewUpdated: 'Avis mis à jour !',
    reviewDeleted: 'Avis supprimé',
    edit: 'Modifier',
    delete: 'Supprimer',
    
    // My Reviews
    myReviewsTitle: 'Mes Avis',
    yourMovieReviews: 'Vos avis et notes de films',
    noReviewsMessage: "Vous n'avez pas encore donné d'avis. Regardez des films et partagez vos impressions !",
    browseMovies: 'Parcourir les Films',
    
    // Add/Edit Movie
    addNewMovie: 'Ajouter un Nouveau Film',
    editMovieTitle: 'Modifier le Film',
    movieTitle: 'Titre',
    movieDirector: 'Réalisateur',
    movieReleaseDate: 'Date de sortie',
    movieSynopsis: 'Synopsis',
    movieRating: 'Note',
    movieImage: "URL de l'image",
    saveMovie: 'Enregistrer',
    movieAdded: 'Film ajouté avec succès !',
    movieUpdated: 'Film mis à jour avec succès !',
    
    // Profile
    myProfile: 'Mon Profil',
    accountSettings: 'Paramètres du Compte',
    updateProfile: 'Mettre à jour le Profil',
    profileUpdated: 'Profil mis à jour !',
    
    // Common
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès',
    back: 'Retour',
    save: 'Enregistrer',
    close: 'Fermer',
    search: 'Rechercher',
    clear: 'Effacer',
    viewDetails: 'Voir les détails',
    seeAll: 'Voir tout',
    
    // Sidebar
    explore: 'Explorer',
    account: 'Compte',
  }
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly STORAGE_KEY = 'app_language';
  
  currentLanguage = signal<Language>(this.getStoredLanguage());
  
  private getStoredLanguage(): Language {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') {
        return stored;
      }
    }
    return 'en';
  }

  get t(): Translations {
    return translations[this.currentLanguage()];
  }

  translate(key: keyof Translations): string {
    return translations[this.currentLanguage()][key];
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'fr' : 'en';
    this.setLanguage(newLang);
  }

  isEnglish(): boolean {
    return this.currentLanguage() === 'en';
  }

  isFrench(): boolean {
    return this.currentLanguage() === 'fr';
  }
}
