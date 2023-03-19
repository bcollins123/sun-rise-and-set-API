import { Controller, Get, Query } from '@nestjs/common';
import {
  AppService,
  SunriseAndSunsetForWeek,
  SunriseSunset,
} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSunriseAndSunset(
    @Query('date') date: string,
  ): Promise<SunriseSunset> {
    return this.appService.getSunriseAndSunset(date);
  }

  @Get('/week')
  async getSunriseAndSunsetForWeek(
    @Query('date') date: string,
  ): Promise<SunriseAndSunsetForWeek> {
    return this.appService.getSunriseAndSunsetForWeek(date);
  }
}
