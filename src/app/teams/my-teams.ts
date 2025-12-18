import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from './teams.service';

//this is the teams the logged in user belongs to

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h2>My Teams</h2>

  <button (click)="load()">Load My Teams</button>

  @if (error) {
    <div style="color:red">{{ error }}</div>
  }

  @if (data) {
    <pre>{{ data | json }}</pre>
  }
`
})
export class MyTeamsComponent {
  data: any = null;
  error = '';

  constructor(private teams: TeamsService) {}

  load() {
    this.error = '';
    this.data = null;

    this.teams.mine().subscribe({
      next: (res) => this.data = res,
      error: (err) => this.error = err?.error ? JSON.stringify(err.error) : 'Request failed'
    });
  }
}
