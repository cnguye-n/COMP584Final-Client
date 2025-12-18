import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface TeamMemberDto {
  userName: string;
  roleInTeam: string;
  teamName?: string;
}

export interface MyTeammatesDto {
  teamName: string;
  teammates: TeamMemberDto[];
}

export interface UserDto {
  userId: string;
  userName: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class TeamMembersService {
  constructor(private http: HttpClient) {}

  /**
   * Get teammates for the logged-in user. The backend may return camelCase or PascalCase
   * properties, so we normalize both here.
   */
  getMyTeammates(): Observable<MyTeammatesDto> {
    return this.http.get<any>(`${environment.apiUrl}api/TeamMembers/mine`).pipe(
      map((res) => {
        const teammatesRaw =
          res?.teammates ?? res?.teamMates ?? res?.members ?? res?.Members ?? res ?? [];

        return {
          teamName: res?.teamName ?? res?.TeamName ?? '',
          teammates: (Array.isArray(teammatesRaw) ? teammatesRaw : []).map((m) =>
            this.mapMember(m)
          )
        } satisfies MyTeammatesDto;
      })
    );
  }

  /**
   * Get all registered users (admin view). If the API wraps the results in a property,
   * we unwrap the most common shapes.
   */
  getAllUsers(): Observable<TeamMemberDto[]> {
    return this.http.get<any>(`${environment.apiUrl}api/TeamMembers`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.users ?? res?.data ?? [])),
      map((users: any[]) => (Array.isArray(users) ? users : [])),
      map((users) => users.map((u) => this.mapMember(u)))
    );
  }

  getUsersNotInTeam(): Observable<UserDto[]> {
    return this.http.get<any>(`${environment.apiUrl}api/Admin/users-not-in-team`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.users ?? res?.data ?? [])),
      map((arr: any[]) => (Array.isArray(arr) ? arr : [])),
      map((arr) =>
        arr.map((u) => ({
          userId: u?.userId ?? u?.UserId ?? '',
          userName: u?.userName ?? u?.UserName ?? u?.username ?? '',
          email: u?.email ?? u?.Email ?? ''
        }))
      )
    );
  }


  private mapMember(raw: any): TeamMemberDto {
    return {
      userName: raw?.userName ?? raw?.UserName ?? raw?.username ?? '',
      roleInTeam: raw?.roleInTeam ?? raw?.RoleInTeam ?? raw?.role ?? '',
      teamName: raw?.teamName ?? raw?.TeamName ?? raw?.team ?? ''
    };
  }
}