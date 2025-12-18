import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login';
import { MyTeamsComponent } from './teams/my-teams';
import { AdminTeamsComponent } from './teams/admin-teams';
import { TeamMembersComponent } from './team-members/team-members';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },

  // real app
  { path: 'my-teams', component: MyTeamsComponent },

  // admin
  { path: 'admin-teams', component: AdminTeamsComponent },
  { path: 'team-members', component: TeamMembersComponent },

  { path: 'login', component: Login }
];



