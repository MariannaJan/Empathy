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
        chapter_number: {
            type: 'number',
        },
        story_id: {
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
        empathy_name: {
            type: 'string',
        },
        sympathy_name: {
            type: 'string',
        },
    },
    required: ['id', 'chapter_number', 'story_id', 'name', 'language', 'empathy_name', 'sympathy_name'],
}