import { LANGUAGES } from "./languages.enum";

export interface ChapterInterface {
    id: string;
    chapterNumber: number;
    storyId: string;
    name: string;
    language: LANGUAGES;
    is_premium?: boolean;
    author?: string;
    pages?: string[];
    description?: string;
    empathyName: string;
    sympathyName: string;
}
