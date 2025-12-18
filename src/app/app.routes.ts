import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login';
import { MyTeamsComponent } from './teams/my-teams';
import { AdminTeamsComponent } from './teams/admin-teams';
import { TeamMembersComponent } from './team-members/team-members';

export const routes: Routes = [
  // Home routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },

  // App
  { path: 'my-teams', component: MyTeamsComponent },
  { path: 'admin-teams', component: AdminTeamsComponent },
  { path: 'team-members', component: TeamMembersComponent },

  // Profile (lazy)
  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.Profile) },

  // Auth
  { path: 'login', component: Login }
];





