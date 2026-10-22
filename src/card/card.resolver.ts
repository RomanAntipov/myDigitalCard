// src/card/card.resolver.ts:

import { Resolver, Query, Info } from '@nestjs/graphql'
import { ProfileType } from './dto/profile.type'
// призма для использования в методах получения объектов.
import { PrismaService } from '../prisma/prisma.service'
import type { GraphQLResolveInfo, FieldNode } from 'graphql'

@Resolver(() => ProfileType)

export class CardResolver {
    constructor (private readonly prisma: PrismaService) {}

    // Метод getProfile будет получать профиль и вложенные сущности.
    // Аргументы - запрос grphql типа GraphQLResolveInfo
    @Query(() => ProfileType, { name: 'profile' })
    async getProfile (@Info() info: GraphQLResolveInfo) {
        // Берём первый элемент запроса 
        // (исходим из того, что в запросе запрос может быть только один элемент, 
        // если их более одного работаем только с первым.)
        const rootNode = info.fieldNodes[0];
        // Если по какой-то причине удалось выделить rootNode - 
        // вернём основные поля профиля и на этом остановимся.
        if (!rootNode || !rootNode.selectionSet) {
            return await this.prisma.client.Profile
                            .select('id', 'name', 'description')   // Список полей
                            .first();       // Терминальный метод: вернет объект или null
        }
        // Массив для хранения полей верхнего уровня
        const selections = rootNode.selectionSet.selections;
        const profileFieldsArr: any[] = this.makePropsStringByAstArr(selections);
        
        // Объект для хранения связей, которые передадим в .include()
        const relationsToInclude: Record<string, any> = {};

        // перебрать в цикле все элементы selections, плоские элементы пропустить, 
        // элементы содержащие selectionSet передать в makePropsStringByAstArr() 
        // для формирования массива строк для вложенных запросов

        for (const item of selections) {
            if (item.kind !== 'Field' || !item.selectionSet) continue;
            const fieldName = item.name.value;

            // Хардкод-проверка: если наименование поля не из списка вложенных - пропустить итерацию.
            if (!['skills', 'projects', 'experience'].includes(fieldName)) continue;

             // 1. Собираем массив строк только для внутренностей этой конкретной связи
            const subFieldsArr = this.makePropsStringByAstArr(item.selectionSet.selections);

            // 2. Передаем собранные поля во вложенный .select() мутатора Prisma 8
            relationsToInclude[fieldName] = (mutator: any) => mutator.select(...subFieldsArr);

        }

        // 3. Базовый запрос
        let baseQuery = this.prisma.client.Profile

        // 4. Если были запрошены вложенные сущности, добавляем их через .include()
        if (Object.keys(relationsToInclude).length > 0) {
            baseQuery = baseQuery.include(relationsToInclude as any);
        }

        // 5. Запрос полей профиля с ранее добавленными include
        return await baseQuery.select(...(profileFieldsArr as any)).first();
    }

    // Формирование массива с перечислением требуемых свойств из AST объекта типа 
    // GraphQLResolveInfo
    // Вложенные поля игнорируются!
    private makePropsStringByAstArr(selectionsArr: readonly any[]) {
        // Если selectionsArr передан пустым вернуть строчку-заглушку "id"
        if (!selectionsArr || !selectionsArr.length) return ["id"];
        let propsString: any[] = [];
        for (const item of selectionsArr) {
            if (item.kind === 'Field' && !item.selectionSet) {
                const fieldName = item.name.value;
                propsString.push(fieldName)
            }
        }
        // Если массив остался пустым - вернуть заглушку 'id'
        return propsString.length ? propsString : ['id'];
    }
}