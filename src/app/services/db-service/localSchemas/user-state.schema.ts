import { RxJsonSchema } from "rxdb";

export const USER_STATE_SCHEMA: RxJsonSchema<any> = {
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
        }
    },
    required: ['id', 'name'],
};
