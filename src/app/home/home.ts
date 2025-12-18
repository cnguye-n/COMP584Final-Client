import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { HomeSummaryData } from '../home-summary-data';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  summary?: HomeSummaryData;
  loading = true;
  error = '';

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
  // load once initially
  this.loadSummary();

  // reload whenever /home is navigated to again
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.loadSummary();
    });
}

  private loadSummary(): void {
    this.loading = true;
    this.error = '';

    this.homeService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Home summary error:', err);
        this.error = 'Failed to load home data.';
        this.loading = false;
      }
    });
  }
}

