import { RxCollection, RxCollectionCreator, RxDatabase, RxDocument } from 'rxdb';
import { USER_STATE_SCHEMA } from './localSchemas/user-state.schema';
import { STORIES_SCHEMA } from './localSchemas/stories.schema';
import { UserStateInterface } from 'src/app/models/user-state.interface';
import { StoryInterface } from 'src/app/models/story.interface';
import { CHAPTERS_SCHEMA } from './localSchemas/chapters.schema';
import { ChapterInterface } from 'src/app/models/chapter.interface';


//local DB

export const LOCAL_DB_NAME = 'local_db';

export enum COLLECTION_NAMES {
    USER_STATE = 'user_state',
    STORIES = 'stories',
    CHAPTERS = 'chapters',
}


export type LocalDbCollectionsType = {
    [key in COLLECTION_NAMES]: RxCollectionCreator<UserStateInterface> | RxCollectionCreator<StoryInterface> | RxCollectionCreator<ChapterInterface>;

};
export type LocalDbType = RxDatabase<{ [key in COLLECTION_NAMES]: RxCollection }>

export const LOCAL_DB_SETUP: LocalDbCollectionsType = {
    user_state: {
        schema: USER_STATE_SCHEMA,
    },
    stories: {
        schema: STORIES_SCHEMA,
    },
    chapters: {
        schema: CHAPTERS_SCHEMA,
    }
};

// remote DB

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBnagIv1jnnkGEMASLY3bJIrc5Iuz-Syks",
    authDomain: "empathy-7224d.firebaseapp.com",
    projectId: "empathy-7224d",
    storageBucket: "empathy-7224d.appspot.com",
    messagingSenderId: "957387697152",
    appId: "1:957387697152:web:a2fd71b0ac7fc060703ce5",
    measurementId: "G-WBFW0YBS26"
};

export const REPLICATION_IDENTIFIER = 'Empathy-to-firebase';
