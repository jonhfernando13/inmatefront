import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginRequest {
  nombres: string;
  clave: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    nombres: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly loginUrl = 'http://127.0.0.1:8000/auth/login';

  private authState$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response) => {
        if (response?.access_token) {
          this.setToken(response.access_token);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
    this.authState$.next(false);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.authState$.value;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  private setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.authState$.next(true);
  }

  private hasToken(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    return !!localStorage.getItem(this.tokenKey);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
