import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherGateway } from './modules/gateways/weather';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WeatherGateway],
})
export class AppModule {}
