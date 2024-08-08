import { RxJsonSchema } from "rxdb";
import { UserStateInterface } from "src/app/models/user-state.interface";

export const USER_STATE_SCHEMA: RxJsonSchema<UserStateInterface> = {
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
        chapters: {
            type: 'array',
        }
    },
    required: ['id', 'name'],
};
