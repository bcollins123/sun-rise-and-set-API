import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class WeatherGateway {
  private waitForMs<T>(callback: () => T, msToWait = 500): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const returnValue = callback();
        resolve(returnValue);
      }, msToWait);
    });
  }

  private generateRandomTimeWithinDate(
    date: Date,
    hourMin: number,
    hourMax: number,
  ): Date {
    const dateTime = DateTime.fromJSDate(date).toUTC().startOf('day');
    const hour = Math.floor(Math.random() * (hourMax + 1 - hourMin)) + hourMin;
    return dateTime.plus({ hours: hour }).toJSDate();
  }

  public async getSunrise(date: Date) {
    return this.waitForMs(() => this.generateRandomTimeWithinDate(date, 4, 7));
  }

  public async getSunset(date: Date) {
    return this.waitForMs(() =>
      this.generateRandomTimeWithinDate(date, 18, 21),
    );
  }
}
