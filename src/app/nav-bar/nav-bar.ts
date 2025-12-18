import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from "@angular/router";
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss'
})
export class NavBar {
constructor(public authService: AuthService){

}
}
