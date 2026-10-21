
// Файл skill.type.ts (класс таблицы навыков)

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SkillType {

    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;
    
}