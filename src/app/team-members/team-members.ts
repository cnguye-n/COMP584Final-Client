import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth/auth-service';
import {
  MyTeammatesDto,
  TeamMemberDto,
  TeamMembersService,
  UserDto
} from './team-members.service';

@Component({
  standalone: true,
  selector: 'app-team-members',
  templateUrl: './team-members.html',
  styleUrls: ['./team-members.scss']
})

export class TeamMembersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly teamMembersService = inject(TeamMembersService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isAdmin = false;
  loading = true;
  error = '';

  // Admin data
  allUsers: TeamMemberDto[] = [];
  usersNotInTeam: UserDto[] = [];

  // Non-admin data
  teammates: TeamMemberDto[] = [];
  teamName = '';

  ngOnInit(): void {
    this.loadData();

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.startsWith('/team-members')) {
          this.loadData();
        }
      });
  }

  private loadData() {
    this.isAdmin = this.authService.isAdmin();
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    if (this.isAdmin) {
      this.teamMembersService.getAllUsers().subscribe({
        next: (users) => {
          this.allUsers = users ?? [];

          this.teamMembersService.getUsersNotInTeam().subscribe({
            next: (missing) => {
              this.usersNotInTeam = missing ?? [];
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.error = this.describeError(err);
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          this.error = this.describeError(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.teamMembersService.getMyTeammates().subscribe({
        next: (res: MyTeammatesDto) => {
          this.teamName = res?.teamName ?? '';
          this.teammates = res?.teammates ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = this.describeError(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  private describeError(err: any): string {
    if (err?.error) {
      return typeof err.error === 'string'
        ? err.error
        : JSON.stringify(err.error);
    }
    return 'Unable to load team members.';
  }
}

