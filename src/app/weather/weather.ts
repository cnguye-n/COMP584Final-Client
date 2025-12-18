import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { WeatherData } from '../weather-data';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-weather',
  imports: [CommonModule,AsyncPipe],
  templateUrl: './weather.html',
  styleUrl: './weather.scss'
})
export class Weather { 
  forecasts$: Observable<WeatherData[]>;

  constructor(http: HttpClient) {
    this.forecasts$ = http.get<WeatherData[]>('http://localhost:5257/weatherforecast');
    
    
  }

}

