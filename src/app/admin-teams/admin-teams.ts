import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { AdminTeamsService } from './admin-teams.service';

@Component({
  standalone: true,
  selector: 'app-admin-teams',
  templateUrl: './admin-teams.html',
  styleUrls: ['./admin-teams.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class AdminTeamsComponent {
  private fb = inject(FormBuilder);
  private api = inject(AdminTeamsService);

  error = '';
  private refresh$ = new BehaviorSubject<void>(undefined);

  addForm = this.fb.group({
    userId: ['', Validators.required],
    teamId: [null as number | null, Validators.required]
  });

  removeForm = this.fb.group({
    membership: ['', Validators.required] // "userId|teamId"
  });

  vm$ = this.refresh$.pipe(
    switchMap(() =>
      combineLatest([
        this.api.getAllUsersWithTeams(),
        this.api.getUsersNotInTeam(),
        this.api.getTeams()
      ])
    )
  );

  refresh() {
    this.refresh$.next();
  }

  addMember() {
    this.error = '';
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const userId = this.addForm.value.userId!;
    const teamId = this.addForm.value.teamId!;

    this.api.addToTeam({ userId, teamId, roleInTeam: 'Member' }).subscribe({
      next: () => {
        this.addForm.reset();
        this.refresh();
      },
      error: (err) => (this.error = this.describeError(err))
    });
  }

  removeMember() {
    this.error = '';
    if (this.removeForm.invalid) {
      this.removeForm.markAllAsTouched();
      return;
    }

    const key = this.removeForm.value.membership!;
    const [userId, teamIdStr] = key.split('|');
    const teamId = Number(teamIdStr);

    this.api.removeFromTeam(teamId, userId).subscribe({
      next: () => {
        this.removeForm.reset();
        this.refresh();
      },
      error: (err) => (this.error = this.describeError(err))
    });
  }

  private describeError(err: any): string {
    if (err?.error) return typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
    return 'Request failed.';
  }
}
