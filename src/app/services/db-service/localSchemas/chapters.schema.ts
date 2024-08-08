import { RxJsonSchema } from "rxdb";
import { ChapterInterface } from "src/app/models/chapter.interface";

export const CHAPTERS_SCHEMA: RxJsonSchema<ChapterInterface> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        chapterNumber: {
            type: 'number',
        },
        storyId: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        language: {
            type: 'string',
        },
        is_premium: {
            type: 'boolean',
        },
        author: {
            type: 'string',
        },
        pages: {
            type: 'array',
        },
        description: {
            type: 'string',
        },
        empathyName: {
            type: 'string',
        },
        sympathyName: {
            type: 'string',
        },
    },
    required: ['id', 'chapterNumber', 'storyId', 'name', 'language', 'empathyName', 'sympathyName'],
}