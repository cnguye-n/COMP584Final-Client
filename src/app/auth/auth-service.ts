import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(loginrequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(environment.apiUrl + 'api/Auth/login', loginrequest)
      .pipe(
        tap((response: any) => {
          const token = response?.token ?? response?.Token;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Decode JWT payload safely (no verification, just reading claims) */
  private getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      // handle base64url -> base64
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  /** Returns roles from common claim keys */
  getRoles(): string[] {
    const p = this.getPayload();
    if (!p) return [];

    // Common places roles show up
    const role =
      p.role ??
      p.roles ??
      p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!role) return [];
    return Array.isArray(role) ? role : [role];
  }

  isAdmin(): boolean {
  return this.getRoles().some(r => (r ?? '').toLowerCase() === 'admin');
}


  /** Display name/email for UI */
  getDisplayName(): string {
    const p = this.getPayload();
    if (!p) return '';

    // Common identity claim keys (ASP.NET + JWT)
    return (
      p.unique_name ??
      p.name ??
      p.preferred_username ??
      p.email ??
      p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
      p.sub ??
      ''
    );
  }

  /** User id (useful for profile/requests if needed) */
  getUserId(): string {
    const p = this.getPayload();
    if (!p) return '';

    return (
      p.nameid ??
      p.userId ??
      p.userid ??
      p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      p.sub ??
      ''
    );
  }

  /** Optional helper for debugging */
  debugClaims(): any {
    return this.getPayload();
  }
}

