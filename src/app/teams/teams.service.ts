import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface MyTeamDto {
  teamId: number;
  name: string;
  myRole: string;
}

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  mine(): Observable<MyTeamDto[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http
      .get<any>(`${environment.apiUrl}api/Teams/mine`, { headers })
      .pipe(
        map((res: any) => (Array.isArray(res) ? res : [])),
        map((teams: any[]) =>
          teams.map((t) => ({
            teamId: t.teamId ?? t.TeamId ?? 0,
            name: t.name ?? t.Name ?? '',
            myRole: t.myRole ?? t.MyRole ?? ''
          }))
        )
      );
  }
}
