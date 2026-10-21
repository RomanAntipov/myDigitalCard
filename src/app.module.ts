import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'
// import { GraphQLModule } from '@nestjs/graphql'
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
// import { join } from 'path';
import { DigitalCardModule } from './card/card.module'

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'myDigitalCard',
    }),
    PrismaModule,
    DigitalCardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
