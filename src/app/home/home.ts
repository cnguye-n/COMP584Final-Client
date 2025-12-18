import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeService } from '../services/home.service';
import { HomeSummaryData } from '../home-summary-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], //required for *ngIf/*ngFor
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  summary?: HomeSummaryData;
  loading = true;
  error = '';

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
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
