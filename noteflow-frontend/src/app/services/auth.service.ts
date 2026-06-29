import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppUser, AuthSession } from '../models/user.model';
import { environment } from '../../environments/environment';

interface AuthApiResponse {
  token: string;
  id: string;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly sessionKey = 'noteflow_session';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentSessionSubject = new BehaviorSubject<AuthSession | null>(this.readSession());

  currentSession$ = this.currentSessionSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<AuthSession> {
    return this.http.post<AuthApiResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      map(response => this.mapToSession(response)),
      tap(session => {
        this.saveSession(session);
      })
    );
  }

  register(fullName: string, email: string, password: string): Observable<AuthSession> {
  return this.http.post<AuthApiResponse>(`${this.apiUrl}/register`, {
    fullName,
    email,
    password
  }).pipe(
    map(response => this.mapToSession(response))
  );
}

  me(): Observable<AuthSession> {
    return this.http.get<AuthApiResponse>(`${this.apiUrl}/me`).pipe(
      map(response => this.mapToSession(response)),
      tap(session => {
        this.saveSession(session);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.currentSessionSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.readSession()?.token;
  }

  isAdmin(): boolean {
    return this.readSession()?.user.role === 'Admin';
  }

  getToken(): string | null {
    return this.readSession()?.token ?? null;
  }

  getCurrentUser(): AuthSession['user'] | null {
    return this.readSession()?.user ?? null;
  }

  getUsersForAdmin(): Omit<AppUser, 'password'>[] {
    const currentUser = this.getCurrentUser();
    return currentUser ? [currentUser] : [];
  }

  private saveSession(session: AuthSession): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    this.currentSessionSubject.next(session);
  }

  private readSession(): AuthSession | null {
    const raw = localStorage.getItem(this.sessionKey);
    return raw ? JSON.parse(raw) as AuthSession : null;
  }

  private mapToSession(response: AuthApiResponse): AuthSession {
    return {
      token: response.token,
      user: {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        createdAt: new Date().toISOString()
      }
    };
  }
}