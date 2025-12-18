import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { HttpClient } from '@angular/common/http';
import { Login } from './login';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { LoginResponse } from './login-response';
import { tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = 'auth_token';
  constructor(private http: HttpClient){}
  login(loginrequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(environment.apiUrl +"api/Admin" , loginrequest)
    .pipe(tap(response => {
      if (response.success){
        localStorage.setItem(this.token, response.token);
      }
    }));
}
 logout(){
  localStorage.removeItem(this.token);
 }
  isLoggedIn():boolean {
    return localStorage.getItem(this.token)!=null;   
    }
}