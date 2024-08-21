import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { COLLECTION_NAMES, FIREBASE_CONFIG, REPLICATION_IDENTIFIER } from '../db-service/db-settings';
import { RxFirestoreReplicationState, replicateFirestore } from 'rxdb/plugins/replication-firestore';
import { RxCollection } from 'rxdb';

@Injectable({
  providedIn: 'root'
})
export class RemoteDbService {

  public firebaseApp: FirebaseApp;

  constructor() {
    this.firebaseApp = initializeApp(FIREBASE_CONFIG);
  }

  public async replicateCollection(
    collectionName: COLLECTION_NAMES,
    localCollection: RxCollection,
  ): Promise<RxFirestoreReplicationState<DocumentData>> {
    const firestoreDatabase = getFirestore(this.firebaseApp);
    const firestoreCollection: CollectionReference<DocumentData, DocumentData> = collection(firestoreDatabase, collectionName);

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
