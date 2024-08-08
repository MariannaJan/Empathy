import { COLLECTION_NAMES } from "../services/db-service/db-settings";

export interface DeleteConfirmationDataInterface {
    id: string;
    name: string;
    collection: COLLECTION_NAMES;
    deleteFunction: CallableFunction;
}