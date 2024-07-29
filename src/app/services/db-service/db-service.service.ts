import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';

import { RxFirestoreReplicationState, replicateFirestore } from 'rxdb/plugins/replication-firestore';

import {
  FIREBASE_CONFIG,
  COLLECTION_NAMES,
  LOCAL_DB_NAME,
  LOCAL_DB_SETUP,
  LocalDbCollectionsType,
  LocalDbType,
  REPLICATION_IDENTIFIER,
} from './db-settings';
import {
  InsertStoryInterface,
  StoryInterface,
} from 'src/app/models/story.interface';


@Injectable({
  providedIn: 'root',
})
export class DbService {
  public localDb: Promise<LocalDbType>;
  public firebaseApp: FirebaseApp;

  constructor() {
    this.localDb = this.setupLocalDb(LOCAL_DB_NAME, LOCAL_DB_SETUP);
    this.firebaseApp = initializeApp(FIREBASE_CONFIG);
  }

  public async setupLocalDb(
    dbName: string,
    dbCollections: LocalDbCollectionsType
  ): Promise<LocalDbType> {
    if (isDevMode()) {
      await import('rxdb/plugins/dev-mode').then(module =>
        addRxPlugin(module.RxDBDevModePlugin)
      );
    }

    const database = await createRxDatabase({
      name: dbName,
      storage: getRxStorageDexie(),
      eventReduce: true,
    });

    await database.addCollections(dbCollections);
    return database as unknown as LocalDbType;
  }

  public addDocument<T>(
    collectionName: COLLECTION_NAMES,
    document: Omit<T, 'id'>,
    id?: string
  ): Promise<T> {
    return this.localDb
      .then(db => {
        const newDocument = {
          ...document,
          id: id ? id : uuidv4(),
        } as T;
        return db[collectionName].insert(newDocument);
      })
      .catch(e => {
        console.log(
          `LOL: Error on adding document into ${collectionName}: ${e}`
        );
        throw new Error(
          `LOL: Error on adding document into ${collectionName}: ${e}`
        );
      });
  }

  public getDocumentsByIds<T>(
    collectionName: COLLECTION_NAMES,
    ids: string[]
  ): Promise<BehaviorSubject<Map<string, T>>> {
    return this.localDb
      .then(db => {
        return db[collectionName].findByIds(ids).$;
      })
      .catch(e => {
        console.log(
          `LOL: Error on getting document from ${collectionName}: ${e}`
        );
        throw new Error(
          `LOL: Error on getting document from ${collectionName}: ${e}`
        );
      });
  }

  public async getDocumentById<T>(
    collectionName: COLLECTION_NAMES,
    id: string
  ): Promise<Observable<T>> {
    const documents$ = await this.getDocumentsByIds<T>(collectionName, [id]);
    return documents$.pipe(map(documents => documents.get(id) as unknown as T));
  }

  public getAllCollectionDocs<T>(
    collectionName: COLLECTION_NAMES
  ): Promise<BehaviorSubject<T[]>> {
    return this.localDb
      .then(db => {
        return db[collectionName].find().$;
      })
      .catch(e => {
        console.log(
          `LOL: Error on getting document from ${collectionName}: ${e}`
        );
        throw new Error(
          `LOL: Error on getting document from ${collectionName}: ${e}`
        );
      });
  }

  // actual implementations for game and editor

  public async getStories(): Promise<BehaviorSubject<StoryInterface[]>> {
    return await this.getAllCollectionDocs<StoryInterface>(
      COLLECTION_NAMES.STORIES
    );
  }

  public async getStoryById(
    id: string
  ): Promise<Observable<StoryInterface | undefined>> {
    const story = await this.getDocumentById<StoryInterface>(
      COLLECTION_NAMES.STORIES,
      id
    );
    console.log(`Story: ${JSON.stringify(story)}`);
    return story;
  }

  public addStory(
    newStory: InsertStoryInterface,
    id?: string
  ): Promise<StoryInterface> {
    return this.addDocument<StoryInterface>(
      COLLECTION_NAMES.STORIES,
      newStory,
      id
    );
  }

  public async replicateCollection(collectionName = COLLECTION_NAMES.STORIES): Promise<RxFirestoreReplicationState<DocumentData>> {
    const firestoreDatabase = getFirestore(this.firebaseApp);
    const firestoreCollection: CollectionReference<DocumentData, DocumentData> = collection(firestoreDatabase, COLLECTION_NAMES.STORIES);
    const localCollection = (await this.localDb).collections[collectionName];

    const replicationState = replicateFirestore(
      {
        collection: localCollection,
        firestore: {
          projectId: FIREBASE_CONFIG.projectId,
          database: firestoreDatabase,
          collection: firestoreCollection
        },
        pull: {},
        push: {},
        live: true,
        replicationIdentifier: REPLICATION_IDENTIFIER,
      }
    );
    console.log(`LOL: REPLICATION for COLEECTION: ${collectionName}: ${replicationState.replicationIdentifier}`);
    return replicationState;
  }
}
