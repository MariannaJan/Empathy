import { LANGUAGES } from "./languages.enum";

export interface ReferenceInterface {
    id: string;
    name: string;
    language: LANGUAGES;
    description: string; // seen on Inspect
    interaction_ids: string[];
}