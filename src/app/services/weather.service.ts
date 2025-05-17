import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherData(cityName: string): Observable<WeatherData> {
   return this.http.get<WeatherData>(environment.weatherApiBaseUrl, {
       headers: new HttpHeaders()
      //  .set(environment.XRapidAPIHostHeaderName, environment.XRapidAPIHostHeaderValue)
      //  .set(environment.XRapidAPIKeyHeaderName, environment.XRapidAPIKeyHeaderValue),  
        .set('x-rapidapi-key', 'b3b586a424msh1014cb4c7d661bep1b21bcjsn7d31f154c823')
        .set('x-rapidapi-host', 'weather-api99.p.rapidapi.com'),
        params: new HttpParams()
        .set('city', cityName)
        // .set('units', 'standard')
        // .set('mode', 'json')
  })
  }
}
