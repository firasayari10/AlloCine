import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = 'http://localhost:8080/users';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
  }

  login(credentials: LoginRequest): Observable<User | null> {
    return this.httpClient.get<User>(`${this.url}/byEmail/${credentials.email}`).pipe(
      map(user => {
        if (user) {
          const { password, ...userWithoutPassword } = user;
          this.currentUser.set(userWithoutPassword as User);
          this.isAuthenticated.set(true);
          this.saveUserToStorage(userWithoutPassword as User);
          return userWithoutPassword as User;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(this.url, data).pipe(
      tap(user => {
        const { password, ...userWithoutPassword } = user;
        this.currentUser.set(userWithoutPassword as User);
        this.isAuthenticated.set(true);
        this.saveUserToStorage(userWithoutPassword as User);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.clearStorage();
    this.router.navigate(['/']);
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/byEmail/${email}`);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.url}/${user.id}`, user).pipe(
      tap(updatedUser => {
        const { password, ...userWithoutPassword } = updatedUser;
        this.currentUser.set(userWithoutPassword as User);
        this.saveUserToStorage(userWithoutPassword as User);
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.httpClient.get<User>(`${this.url}/byEmail/${email}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
