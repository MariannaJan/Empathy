import { RxJsonSchema } from "rxdb";
import { StoryInterface } from "src/app/models/story.interface";

export const STORIES_SCHEMA: RxJsonSchema<StoryInterface> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100 // <- the primary key must have set maxLength
        },
        name: {
            type: 'string',
        },
        languages: {
            type: 'array',
        },
        description: {
            type: 'string'
        }
    },
    required: ['id', 'name', 'languages'],
};