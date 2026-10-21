import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CardResolver } from './card.resolver';

@Module({
    providers: [CardResolver],
    imports: [PrismaModule],
})

export class DigitalCardModule {}