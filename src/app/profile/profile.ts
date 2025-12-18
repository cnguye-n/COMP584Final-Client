import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../auth/auth-service';
import { TeamsService } from '../teams/teams.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  username = '';
  jwtSystemRole = 'User';
  teamRole = 'Member';
  teams: any[] = [];

  constructor(
    public authService: AuthService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    // Logged-in username
    this.username = this.authService.getDisplayName();

    // JWT System Role
    this.jwtSystemRole = this.authService.isAdmin() ? 'Admin' : 'User';

    // Load teams from existing API
    this.teamsService.mine().subscribe({
      next: (teams) => {
        this.teams = teams ?? [];

        // If user is Owner of ANY team → Owner
        const role = (r: any) => (r ?? '').toString().toLowerCase();
        const anyOwner = this.teams.some(
          t => (t.myRole ?? '').toString().toLowerCase() === 'owner'
        );
        this.teamRole = anyOwner ? 'Owner' : 'Member';
      },
      error: (err) => {
        console.error('Failed to load teams', err);
        this.teams = [];
        this.teamRole = 'Member';
      }
    });
  }
}
