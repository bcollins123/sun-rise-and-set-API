/* eslint-disable unicorn/prevent-abbreviations */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { DateTime } from 'luxon';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /', () => {
    it('returns a sunrise and sunset for the given date', async () => {
      const testDate = '2022-01-01T00:00:00.000Z';
      const { body, status } = await request(app.getHttpServer()).get(
        `?date=${testDate}`,
      );
      expect(status).toBe(HttpStatus.OK);

      const inputDate = DateTime.fromISO(testDate)
        .toUTC()
        .toLocaleString(DateTime.DATE_FULL);
      expect(inputDate).toEqual(
        DateTime.fromISO(body.sunrise)
          .toUTC()
          .toLocaleString(DateTime.DATE_FULL),
      );
      expect(inputDate).toEqual(
        DateTime.fromISO(body.sunset)
          .toUTC()
          .toLocaleString(DateTime.DATE_FULL),
      );

      expect(DateTime.fromISO(body.sunrise).toUTC().hour).toBeLessThan(
        DateTime.fromISO(body.sunset).toUTC().hour,
      );
    });
  });

  describe('GET /week', () => {
    it('returns a sunrise and sunset for the week as starting on Monday and ending on Sunday', async () => {
      const testDate = '2022-01-01T00:00:00.000Z';
      const { body, status } = await request(app.getHttpServer()).get(
        `/week?date=${testDate}`,
      );
      expect(status).toBe(HttpStatus.OK);
      const inputDate = DateTime.fromISO(testDate);
      const startDate = inputDate.startOf('week');
      Object.keys(body).map((dayOfWeek, index) => {
        const element = body[dayOfWeek];
        const date = startDate
          .plus({ days: index })
          .toUTC()
          .toLocaleString(DateTime.DATE_FULL);
        expect(date).toEqual(
          DateTime.fromISO(element.sunrise)
            .toUTC()
            .toLocaleString(DateTime.DATE_FULL),
        );
        expect(date).toEqual(
          DateTime.fromISO(element.sunset)
            .toUTC()
            .toLocaleString(DateTime.DATE_FULL),
        );
        expect(DateTime.fromISO(element.sunrise).toUTC().hour).toBeLessThan(
          DateTime.fromISO(element.sunset).toUTC().hour,
        );
      });
    });
  });
});
