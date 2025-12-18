import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-teams',
  imports: [CommonModule],
  template: `
    <h2>Teams (Admin)</h2>
    <p>This page will manage teams.</p>
  `
})
export class AdminTeamsComponent {}
