import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { HomeSummaryData } from '../home-summary-data';

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

  constructor(private homeService: HomeService, private cdr: ChangeDetectorRef)  {}

  ngOnInit(): void {
    this.homeService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Home summary error:', err);
        this.error = 'Failed to load home data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
