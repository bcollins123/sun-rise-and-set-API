import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { WeatherGateway } from './modules/gateways/weather';

export interface SunriseSunset {
  sunrise: Date | string;
  sunset: Date | string;
}

export interface SunriseAndSunsetForWeek {
  monday: SunriseSunset;
  tuesday: SunriseSunset;
  wednesday: SunriseSunset;
  thursday: SunriseSunset;
  friday: SunriseSunset;
  saturday: SunriseSunset;
  sunday: SunriseSunset;
}

@Injectable()
export class AppService {
  constructor(private weatherGateway: WeatherGateway) {}

  public async getSunriseAndSunset(input: string): Promise<SunriseSunset> {
    const date = DateTime.fromISO(input).toJSDate();

    const sunrise = await this.weatherGateway.getSunrise(date);
    const sunset = await this.weatherGateway.getSunset(date);

    return {
      sunrise,
      sunset,
    };
  }

  public async getSunriseAndSunsetForWeek(
    input: string,
  ): Promise<SunriseAndSunsetForWeek> {
    const inputDate = DateTime.fromISO(input);

    // Calculate the start and end dates for the week
    const startDate = inputDate.startOf('week');

    // Calculate sunrise/sunset times for each day of the week
    const sunriseAndSunsetForWeek: SunriseAndSunsetForWeek = {
      monday: { sunrise: '', sunset: '' },
      tuesday: { sunrise: '', sunset: '' },
      wednesday: { sunrise: '', sunset: '' },
      thursday: { sunrise: '', sunset: '' },
      friday: { sunrise: '', sunset: '' },
      saturday: { sunrise: '', sunset: '' },
      sunday: { sunrise: '', sunset: '' },
    };

    const promises = Object.keys(sunriseAndSunsetForWeek).map(
      async (dayOfWeek, index) => {
        const dateString = startDate.plus({ days: index }).toString();
        sunriseAndSunsetForWeek[dayOfWeek] = await this.getSunriseAndSunset(
          dateString,
        );
        return sunriseAndSunsetForWeek[dayOfWeek];
      },
    );

    await Promise.all(promises);
    return sunriseAndSunsetForWeek;
  }
}
