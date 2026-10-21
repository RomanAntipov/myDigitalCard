
// Файл project.type.ts (класс таблицы проектов)

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ProjectType {

    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    link: string;
    
}