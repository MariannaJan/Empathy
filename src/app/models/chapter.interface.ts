import { LANGUAGES } from "./languages.enum";

export interface ChapterInterface {
    id: string;
    chapter_number: number;
    story_id: string;
    name: string;
    language: LANGUAGES;
    is_premium?: boolean;
    author?: string;
    pages?: string[];
    description?: string;
    empathy_name: string;
    sympathy_name: string;
}
