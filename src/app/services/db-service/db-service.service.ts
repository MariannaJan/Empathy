import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDocument, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
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
import { StoryInterface } from 'src/app/models/story.interface';


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
    addRxPlugin(RxDBLeaderElectionPlugin);
    addRxPlugin(RxDBCleanupPlugin);

    const database = await createRxDatabase({
      name: dbName,
      storage: getRxStorageDexie(),
      eventReduce: true,
      cleanupPolicy: {
        /**
         * The minimum time in milliseconds for how long
         * a document has to be deleted before it is
         * purged by the cleanup.
         * [default=one month]
         */
        minimumDeletedTime: 1000 * 60 * 60 * 24 * 31, // one month,
        /**
         * The minimum amount of that that the RxCollection must have existed.
         * This ensures that at the initial page load, more important
         * tasks are not slowed down because a cleanup process is running.
         * [default=60 seconds]
         */
        minimumCollectionAge: 1000 * 60, // 60 seconds
        /**
         * After the initial cleanup is done,
         * a new cleanup is started after [runEach] milliseconds 
         * [default=5 minutes]
         */
        runEach: 1000 * 60 * 5, // 5 minutes
        /**
         * If set to true,
         * RxDB will await all running replications
         * to not have a replication cycle running.
         * This ensures we do not remove deleted documents
         * when they might not have already been replicated.
         * [default=true]
         */
        awaitReplicationsInSync: true,
        /**
         * If true, it will only start the cleanup
         * when the current instance is also the leader.
         * This ensures that when RxDB is used in multiInstance mode,
         * only one instance will start the cleanup.
         * [default=true]
         */
        waitForLeadership: true
      }
    });

    await database.addCollections(dbCollections);
    return database as unknown as LocalDbType;
  }

  public addDocument<T>(
    collectionName: COLLECTION_NAMES,
    document: Omit<T, 'id'>,
    id?: string
  ): Promise<RxDocument<T>> {
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
  ): Promise<BehaviorSubject<Map<string, RxDocument<T>>>> {
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
  ): Promise<Observable<RxDocument<T>>> {
    const documents$ = await this.getDocumentsByIds<T>(collectionName, [id]);
    return documents$.pipe(map(documents => documents.get(id) as unknown as RxDocument<T>));
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

  public async updateDocument<T>(
    collectionName: COLLECTION_NAMES,
    documentId: string,
    newDocument: T): Promise<RxDocument<T>> {
    const db = await this.localDb;
    return db[collectionName].findByIds([documentId]).exec()
      .then((docs) => docs.get(documentId) as unknown as RxDocument<T>)
      .then((document) => document.patch(newDocument))
      .catch((e) => {
        console.log(`LOL: Error on updating document id: ${documentId} in collection ${collectionName}: ${e}`);
        throw new Error((`LOL: Error on updating document id: ${documentId} in collection ${collectionName}: ${e}`));
      });
  }

  public async deleteDocument<T>(
    collectionName: COLLECTION_NAMES,
    documentId: string,
  ): Promise<RxDocument<T>> {
    const db = await this.localDb;
    return db[collectionName].findByIds([documentId]).exec()
      .then((docs) => docs.get(documentId) as unknown as RxDocument<T>)
      .then((document) => document.remove())
      .catch((e) => {
        console.log(`LOL: Error on removing document id: ${documentId} from collection: ${collectionName}`);
        throw new Error(`LOL: Error on removing document id: ${documentId} from collection: ${collectionName}`);
      })
  }

  public async cleanupCollection(collectionName: COLLECTION_NAMES,) {
    const db = await this.localDb;
    await db[collectionName].cleanup(0);
  }

  // remote database

  public async replicateCollection(collectionName: COLLECTION_NAMES): Promise<RxFirestoreReplicationState<DocumentData>> {
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

  // actual implementations for game and editor

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

}
