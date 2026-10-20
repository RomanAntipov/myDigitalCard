// prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Пробрасываем типизированный инстанс клиента наружу
  public readonly db = db;

  async onModuleInit() {
    console.log('PrismaService инициализирован');
    // Сюда мы чуть позже добавим логику автоматического сидинга
  }

  async onModuleDestroy() {
    console.log('Соединение с базой данных закрыто');
  }
}