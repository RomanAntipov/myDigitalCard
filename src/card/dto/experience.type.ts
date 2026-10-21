
// Файл project.type.ts (класс таблицы проектов)


// 3. Файл experience.type.ts (Опыт работы)

// Тут есть два интересных поля: даты и массив достижений.

// • Даты (startDate, endDate): Поскольку в Prisma они у тебя сохранены как строки формата ISO (TimestamptzString), в GraphQL размечай их декоратором @Field(() => String).
// • Достижения (achievement): В Prisma это массив строк String[]. В GraphQL-декораторе массив строк описывается с помощью квадратных скобок: @Field(() => [String]). Тип свойства в TypeScript будет string[].

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ExperienceType {

    @Field(() => ID)
    id: string;

    @Field(() => String)
    company: string;

    @Field(() => String)
    position: string;

    @Field(() => String)
    startDate: string;

    @Field(() => String, { nullable: true })
    endDate?: string;

    @Field(() => [String])
    achievement: string[];

}