import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export type AdminUserRowDto = {
  userId: string;
  userName: string;
  email?: string;

  teamId?: number | null;
  teamName?: string | null;
  roleInTeam?: string | null;
};

export type UserNotInTeamDto = {
  userId: string;
  userName: string;
  email?: string;
};

export type TeamDto = {
  teamId: number;
  name: string;
};

@Injectable({ providedIn: 'root' })
export class AdminTeamsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // your updated GET /api/Admin/users (now includes team info)
  getAllUsersWithTeams(): Observable<AdminUserRowDto[]> {
    return this.http.get<AdminUserRowDto[]>(this.baseUrl + 'api/Admin/users');
  }

  getUsersNotInTeam(): Observable<UserNotInTeamDto[]> {
    return this.http.get<UserNotInTeamDto[]>(this.baseUrl + 'api/Admin/users-not-in-team');
  }

  getTeams(): Observable<TeamDto[]> {
    return this.http.get<TeamDto[]>(this.baseUrl + 'api/Teams');
  }

  // POST /api/Admin/add-to-team  (BODY)
  addToTeam(payload: { teamId: number; userId: string; roleInTeam?: string }) {
    return this.http.post(this.baseUrl + 'api/Admin/add-to-team', payload);
  }

  // DELETE /api/Admin/remove-from-team?teamId=1&userId=abc  (QUERY PARAMS)
  removeFromTeam(teamId: number, userId: string) {
    const url =
      this.baseUrl +
      `api/Admin/remove-from-team?teamId=${teamId}&userId=${encodeURIComponent(userId)}`;
    return this.http.delete(url);
  }
}
