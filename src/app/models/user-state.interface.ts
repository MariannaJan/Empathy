export interface UserStateInterface {
    id: string;
    name: string;
    chapters: UserChaptersInterface[];
};

export interface UserChaptersInterface {
    chapterId: string;
    pageId: string;
    inventory: string[];
    journal: string[];
    empathy: number;
    sympathy: number;
}