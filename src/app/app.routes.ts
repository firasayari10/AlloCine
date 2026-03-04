import { Routes , RouterModule} from '@angular/router';
import { Home } from './home/home.component';
import {MoviesListComponent} from './movies-list/movies-list.component';
import { NgModule } from '@angular/core';

import { AddMovieComponent} from './add-movie/add-movie.component'
import { UpdateMovie } from './update-movie/update-movie';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { ProfileComponent } from './profile/profile';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard, guestGuard } from './guards/auth.guard';


export const routes: Routes = [
    {path:'',component:Home},
    {path:'movies',component:MoviesListComponent},
    {path:'add-movie',component:AddMovieComponent, canActivate: [authGuard]},
    {path:'movie/:id',component:MovieDetailComponent},
    {path:'update-movie/:id',component:UpdateMovie, canActivate: [authGuard]},
    {path:'profile',component:ProfileComponent, canActivate: [authGuard]},
    {path:'my-reviews',component:MyReviewsComponent, canActivate: [authGuard]},
    {path:'admin',component:AdminComponent, canActivate: [authGuard]},
    {path:'login',component:LoginComponent, canActivate: [guestGuard]},
    {path:'register',component:RegisterComponent, canActivate: [guestGuard]},
    {path:'forgot-password',component:ForgotPasswordComponent, canActivate: [guestGuard]},
    {path:'reset-password',component:ResetPasswordComponent, canActivate: [guestGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],    
exports: [RouterModule]     })

export class AppRoutingModule { }