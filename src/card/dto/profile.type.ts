
// Файл project.type.ts (класс таблицы проектов)

// 4. Файл profile.type.ts (Главный профиль)

// Этот тип собирает всё воедино.

// • Связанные массивы полей (Критично для ТЗ!): Нам нужно объявить вложенные массивы для навыков, проектов и опыта.
// 	• Для навыков: @Field(() => [SkillType]) над свойством skills!: SkillType[];
// 	• Для проектов: @Field(() => [ProjectType]) над свойством projects!: ProjectType[];
// 	• Для опыта: @Field(() => [ExperienceType]) над свойством experience!: ExperienceType[];

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SkillType } from './skill.type';
import { ExperienceType } from './experience.type';
import { ProjectType } from './project.type';

@ObjectType()
export class ProfileType {

    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    description?: string;
    
    @Field(() => [SkillType])
    skills!: SkillType[];
    
    @Field(() => [ExperienceType])
    experience!: ExperienceType[];

    @Field(() => [ProjectType])
    projects!: ProjectType[];
}