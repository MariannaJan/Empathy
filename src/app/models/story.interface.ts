export interface StoryInterface {
    id: string;
    name: string;
    is_premium: boolean;
    languages: string[];
}

export type InsertStoryInterface = Omit<StoryInterface, 'id'>;
