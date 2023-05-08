import { ApiRequestLog } from './entities/api-request-log.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DaiModule } from './modules/dai/dai.module';
import { Connection } from 'typeorm';
import { DaiTransaction } from './modules/dai/dai-transaction.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { MiddlewareConsumer } from '@nestjs/common';
import { ApiRequestLoggerMiddleware } from './middlewares/api-request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [DaiTransaction, ApiRequestLog],
      migrations: ['src/migrations/*{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    DaiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRequestLoggerMiddleware).forRoutes('*');
  }
}
