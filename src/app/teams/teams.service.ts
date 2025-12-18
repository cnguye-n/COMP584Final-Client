import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  constructor(private http: HttpClient) {}

  mine(): Observable<any> {
    return this.http.get(environment.apiUrl + 'api/Teams/mine');
  }
}
