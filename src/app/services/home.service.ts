import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HomeSummaryData } from '../home-summary-data';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<HomeSummaryData> {
    return this.http.get<HomeSummaryData>(
      environment.apiUrl + 'api/Home/summary'
    );
  }
}
