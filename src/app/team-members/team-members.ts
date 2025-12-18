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
  template: `
    <div class="page">
      <h2>Team Members</h2>

      @if (isAdmin) {
        <p class="intro">
          You have admin access. Showing team memberships and users not assigned to any team.
        </p>
      } @else {
        <p class="intro">
          Showing teammates for your current team.
        </p>
      }

      @if (loading) {
        <div class="status">Loading team members...</div>
      } @else if (error) {
        <div class="status error">{{ error }}</div>
      } @else {

        <!-- ================= ADMIN VIEW ================= -->
        @if (isAdmin) {

          <!-- Team Memberships -->
          <h3 class="section-title">Team Memberships</h3>

          @if (allUsers.length > 0) {
            <table class="members-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Role In Team</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                @for (user of allUsers; track user.userName) {
                  <tr>
                    <td>{{ user.userName }}</td>
                    <td>{{ user.roleInTeam }}</td>
                    <td>{{ user.teamName }}</td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <div class="status">No team membership records found.</div>
          }

          <!-- Users Not In Any Team -->
          <h3 class="section-title" style="margin-top: 1.5rem;">
            Users Not In A Team
          </h3>

          @if (usersNotInTeam.length > 0) {
            <table class="members-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                @for (u of usersNotInTeam; track u.userId) {
                  <tr>
                    <td>{{ u.userName }}</td>
                    <td>{{ u.email || '—' }}</td>
                    <td>Not in a team</td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <div class="status">All users are assigned to a team.</div>
          }

        }

        <!-- ================= NON-ADMIN VIEW ================= -->
        @else {

          <div class="team-header">
            Team: {{ teamName || 'Unassigned' }}
          </div>

          @if (teammates.length > 0) {
            <div class="teammates">
              @for (member of teammates; track member.userName) {
                <div class="teammate">
                  <div class="name">{{ member.userName }}</div>
                  <div class="role">{{ member.roleInTeam }}</div>
                </div>
              }
            </div>
          } @else {
            <div class="status">No teammates found.</div>
          }

        }
      }
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 900px;
        margin: 0 auto;
        padding: 1rem;
      }

      .intro {
        margin-bottom: 1rem;
        color: #555;
      }

      .section-title {
        margin: 0.75rem 0;
        font-weight: 700;
      }

      .status {
        padding: 0.75rem 1rem;
        border-radius: 6px;
        background: #f3f4f6;
        color: #555;
      }

      .status.error {
        background: #fdecea;
        color: #b71c1c;
      }

      .members-table {
        width: 100%;
        border-collapse: collapse;
      }

      .members-table th,
      .members-table td {
        text-align: left;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid #ddd;
      }

      .team-header {
        font-weight: 600;
        margin-bottom: 0.75rem;
      }

      .teammates {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 0.75rem;
      }

      .teammate {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 0.75rem;
        background: #fff;
      }

      .name {
        font-weight: 600;
      }

      .role {
        color: #6b7280;
      }
    `
  ]
})
export class TeamMembersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly teamMembersService = inject(TeamMembersService);
  private readonly router = inject(Router);

  // ✅ zoneless fix
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

