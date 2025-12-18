import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-team-members',
  imports: [CommonModule],
  template: `
    <h2>Team Members (Admin)</h2>
    <p>This page will manage team members.</p>
  `
})
export class TeamMembersComponent {}
