import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { DaiService } from './dai.service';
import { DaiController } from './dai.controller';
import { DaiListenerService } from './dai-listener.service';
import { DaiTransaction } from './dai-transaction.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { ApiKeyMiddleware } from '../../middlewares/api-key.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaiTransaction]),
    ScheduleModule.forRoot(),
  ],
  controllers: [DaiController],
  providers: [
    DaiService,
    DaiListenerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [DaiService],
})
export class DaiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(DaiController);
  }
}
