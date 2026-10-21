// src/card/card.resolver.ts:

import { Resolver, Query } from '@nestjs/graphql'
import { ProfileType } from './dto/profile.type'
// призма для использования в методах получения объектов.
import { PrismaService } from '../prisma/prisma.service'
import { GraphQLResolveInfo } from 'graphql'

@Resolver(() => ProfileType)

export class CardResolver {
    constructor (private readonly prisma: PrismaService) {}

    @Query(() => ProfileType, { name: 'profile' })
    async getProfile () {
        return await this.prisma.client.Profile
            .select('id', 'name', 'description')   // Список полей
            .first();       // Терминальный метод: вернет объект или null
    }
}