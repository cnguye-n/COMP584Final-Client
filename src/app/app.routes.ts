import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Weather } from './weather/weather';
import { City } from './city/city';
import { Country } from './country/country';
import { CountryPopulation } from './country-population/country-population';
import { Login } from './auth/login';

export const routes: Routes = [
    {path: '', component:Home, pathMatch: 'full'},
    {path:'weather',component:Weather},
    {path:'city',component:City},
    {path:'country',component:Country},
    {path:'country-population/:id',component:CountryPopulation},
    {path:'login', component: Login}

];


