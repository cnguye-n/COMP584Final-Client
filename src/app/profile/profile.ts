import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, shareReplay } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { TeamsService, MyTeamDto } from '../teams/teams.service';

type ProfileVm = {
  username: string;
  email: string;
  jwtSystemRole: 'Admin' | 'User';
  teamRole: 'Owner' | 'Member';
  teams: MyTeamDto[];
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private authService = inject(AuthService);
  private teamsService = inject(TeamsService);

  showPw = false;
  newPassword = '';
  confirmPassword = '';

  vm$ = this.teamsService.mine().pipe(
    map((teams) => {
      const username = this.authService.getDisplayName();
      const email = this.authService.getEmail?.() ?? ''; // implement in AuthService after adding email claim
      const jwtSystemRole: 'Admin' | 'User' = this.authService.isAdmin() ? 'Admin' : 'User';

      const anyOwner = (teams ?? []).some(
        t => (t.myRole ?? '').toString().toLowerCase() === 'owner'
      );
      const teamRole: 'Owner' | 'Member' = anyOwner ? 'Owner' : 'Member';

      return { username, email, jwtSystemRole, teamRole, teams: teams ?? [] } as ProfileVm;
    }),
    shareReplay(1)
  );

  changePassword() {
    // Not implemented yet - needs backend endpoint.
    // For now just basic client validation:
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Change password endpoint not wired yet.');
  }
}
