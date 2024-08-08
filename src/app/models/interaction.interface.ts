export interface Interaction {
    id: string;
    name: string;
    description: string;
    next_page_id?: string;
    journal_entry_id?: string;
    empathy_modifier?: number;
    sympathy_modifier?: number;
}