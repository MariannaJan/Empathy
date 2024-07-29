import { RxJsonSchema } from "rxdb";
import { StoryInterface } from "src/app/models/story.interface";

export const STORIES_SCHEMA: RxJsonSchema<StoryInterface> = {
    version: 0,
    primaryKey: `id`,
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100 // <- the primary key must have set maxLength
        },
        name: {
            type: 'string',
        },
        is_premium: {
            type: 'boolean',
        },
        languages: {
            type: 'array',
        }
    }
};