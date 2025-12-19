import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login';
import { AdminTeamsComponent } from './teams/admin-teams';
import { TeamMembersComponent } from './team-members/team-members';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },

  { path: 'admin-teams', component: AdminTeamsComponent },
  { path: 'team-members', component: TeamMembersComponent },

  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.Profile) },

  { path: 'login', component: Login },

  // optional safety
  { path: '**', redirectTo: 'home' }
];




