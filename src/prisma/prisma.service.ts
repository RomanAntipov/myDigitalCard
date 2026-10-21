// prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from './db';
import { content } from './content';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Пробрасываем типизированный инстанс клиента наружу
  public readonly db = db;

  async onModuleInit() {
    console.log ('PrismaService инициализирован');
    // Устанавливаем соединение с БД.
    // Должно работать и без этого, но оставляю для логичности кода.
    await this.db.connect();
    // Автозаполнение БД (если ещё пустая).
    await this.seed()
  }

  async onModuleDestroy() {
    console.log('Соединение с базой данных закрыто');
  }

  private async seed() {
    // Получить количество строк в таблице Profile (если их более 0 БД считаем не пустой).
    // В Prisma 8 метод count возвращает тип IncludeScalar<number>
    // Для работы сравнения сделаем приведение типов.
    const existingProfileInDb = await this.db.orm.public.Profile
    .select('id')   // Указываем, какое поле вернуть
    .limit(1)       // Ограничиваем выборку одной строкой
    .first();       // Терминальный метод: вернет объект или null

    // если count > 0 - прекратить выполнение.
    if (existingProfileInDb !== null)
      {
        console.log('БД не пуста, автозаполнение не требуется.')
        return;
      }
    // Иначе выполняем заполнение данными из content.ts
    console.log('Запуск автозаполнения заполнения БД.')

    try {
      // Создание строки в таблице Profile и каскадное заполнение связанных таблиц
      await  this.db.orm.public.Profile.create({
          name: content.name,
          description: content.description,
          
          // Заполняем связь с моделью Skill
          // В Prisma 8 связи передаются через колбэк с мутатором:
          // content.skills - массив объектов вида 
          //      { "name": "JavaScript" },
          //      { "name": "Node.js" },
          skills: (mutator: any) => mutator.create(content.skills),
          
          // Заполняем связь с моделью Experience
          // Используется перебор элементов массива для преобразования дат из строки ISO
          // в объект "дата"
          experience: (mutator: any) => mutator.create(content.experience.map(exp => ({
              company: exp.company,
              // поля типа DateTime (в content.json хранятся как строки ISO):
              // startDate: Temporal.Instant.from(exp.startDate),
              // endDate: Temporal.Instant.from(exp.endDate),
              startDate: exp.startDate,
              endDate: exp.endDate,
              // Массив строк Text[]
              achievement: exp.achievement,
            }))),
          
          // Заполняем связь с моделью Project
          projects: (mutator: any) => mutator.create(content.projects),
        },
      );
    } catch (e) {
      console.error('Заполнение завершилось с ошибкой', e)
    }
  }
}