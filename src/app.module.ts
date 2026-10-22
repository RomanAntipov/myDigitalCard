import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { DigitalCardModule } from './card/card.module'

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    }),
    DigitalCardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
