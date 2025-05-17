import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { WeatherData } from './models/weather.model';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  weatherData = signal<WeatherData | null>(null);
  cityName = signal('Hà Nội');
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.fetchWeatherData(this.cityName());
  }

  getWeatherDataOfCity(city: string): void {
    // Validate input
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      this.error.set('Please enter a city name.');
      return;
    }

    // Optional: Validate for alphabetic characters, spaces, and hyphens
    const validCityPattern = /^[A-Za-zÀ-ỹ\s-]+$/;
    if (!validCityPattern.test(trimmedCity)) {
      this.error.set('City name can only contain letters, spaces, or hyphens.');
      return;
    }

    this.cityName.set(trimmedCity);
    this.fetchWeatherData(this.cityName());
  }

  private fetchWeatherData(city: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.weatherService.getWeatherData(city).subscribe({
      next: (response) => {
        // Transform temperatures to Celsius immutably
        const transformedData: WeatherData = {
          ...response,
          main: {
            ...response.main,
            temp: response.main.temp - 273.15,
            temp_min: response.main.temp_min - 273.15,
            temp_max: response.main.temp_max - 273.15,
          },
        };
        this.weatherData.set(transformedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        // Handle specific API errors
        if (err.status === 404) {
          this.error.set('City not found. Please check the city name.');
        } else {
          this.error.set('Failed to fetch weather data. Please try again later.');
        }
        this.weatherData.set(null);
        this.isLoading.set(false);
        console.error('Weather API error:', err);
      },
    });
  }
}