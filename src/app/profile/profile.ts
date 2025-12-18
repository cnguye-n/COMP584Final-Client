import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { map, shareReplay } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { TeamsService, MyTeamDto } from '../teams/teams.service';

type ProfileVm = {
  username: string;
  jwtSystemRole: 'Admin' | 'User';
  teamRole: 'Owner' | 'Member';
  teams: MyTeamDto[];
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private authService = inject(AuthService);
  private teamsService = inject(TeamsService);

  vm$ = this.teamsService.mine().pipe(
    map((teams) => {
      const username = this.authService.getDisplayName();
      const jwtSystemRole: 'Admin' | 'User' = this.authService.isAdmin() ? 'Admin' : 'User';

      const anyOwner = (teams ?? []).some(
        t => (t.myRole ?? '').toString().toLowerCase() === 'owner'
      );

      const teamRole: 'Owner' | 'Member' = anyOwner ? 'Owner' : 'Member';

      return {
        username,
        jwtSystemRole,
        teamRole,
        teams: teams ?? []
      } as ProfileVm;
    }),
    shareReplay(1)
  );
}
