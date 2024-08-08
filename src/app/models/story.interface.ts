import { LANGUAGES } from "./languages.enum";

export interface StoryInterface {
    id: string;
    name: string;
    languages: Array<LANGUAGES>;
    description?: string;
}
