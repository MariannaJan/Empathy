import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RxCollection, RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { isDevMode } from '@angular/core';
import { replicateFirestore } from 'rxdb/plugins/replication-firestore';

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

  public myDatabase: Promise<RxDatabase<{ todos: RxCollection }>> | undefined = undefined;

  todoSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        maxLength: 100 // <- the primary key must have set maxLength
      },
      name: {
        type: 'string'
      },
      done: {
        type: 'boolean'
      },
      timestamp: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: ['id', 'name', 'done', 'timestamp']
  }

  constructor() {
    this.myDatabase = this.createDb();
  }

  async createDb(): Promise<RxDatabase<{ todos: RxCollection }>> {
    if (isDevMode()) {
      await import('rxdb/plugins/dev-mode').then(
        module => addRxPlugin(module.RxDBDevModePlugin)
      );
    }

    const db = createRxDatabase({
      name: 'mydatabase',
      storage: getRxStorageDexie()
    }).then((myDatabase) => {
      myDatabase.addCollections({
        todos: {
          schema: this.todoSchema,
        }
      });
      return myDatabase;
    });
    console.log('LOL: DB created');
    return db as unknown as Promise<RxDatabase<{ todos: RxCollection }>>;
  }

  async addDocument() {
    let i = 3;
    if (this.myDatabase) {
      await this.myDatabase.then((db) => {
        db.todos.insert({
          id: `todo_${i}`,
          name: 'Learn RxDB',
          done: false,
          timestamp: new Date().toISOString()
        });;
      });
      console.log('LOL: doc added');
      i++;
    }
    else console.log('LOL: No DB!');
  }

  async getDocs() {
    if (this.myDatabase) {
      const docs = await this.myDatabase.then((db) => {
        return db.todos.find({
          selector: {
            id: {
              $eq: 'todo1'
            }
          }
        }).exec();
      });
      console.log(`LOL: ${JSON.stringify(docs)}`);
    }
    else console.log('LOL: No docs!');
  }

  async replicate() {


    const firebaseConfig = {
      apiKey: "AIzaSyBnagIv1jnnkGEMASLY3bJIrc5Iuz-Syks",
      authDomain: "empathy-7224d.firebaseapp.com",
      projectId: "empathy-7224d",
      storageBucket: "empathy-7224d.appspot.com",
      messagingSenderId: "957387697152",
      appId: "1:957387697152:web:a2fd71b0ac7fc060703ce5",
      measurementId: "G-WBFW0YBS26"
    };

    const app = initializeApp(firebaseConfig);

    const firestoreDatabase = getFirestore(app);
    const firestoreCollection: CollectionReference<DocumentData, DocumentData> = collection(firestoreDatabase, 'todos');

    // const docRef = doc(firestoreDatabase, "todos", "todo2");
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   console.log("LOL: Document data:", docSnap.data());
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("LOL: No such document!");
    // }

    const myRxCollection = await this.myDatabase?.then((db) => db.todos);
    if (myRxCollection) {
      console.log(`LOL: myRxCollection ${Object.keys(myRxCollection)}`);
      console.log(`LOL: database ${myRxCollection.database}`);
      console.log(`LOL: name ${myRxCollection.name}`);
      console.log(`LOL: schema ${myRxCollection.schema.primaryPath}`);

    }

    const replicationState = await replicateFirestore(
      {
        collection: myRxCollection,
        firestore: {
          projectId: 'empathy-7224d',
          database: firestoreDatabase,
          collection: firestoreCollection
        },
        pull: {},
        push: {},
        live: true,
        replicationIdentifier: 'Empathy-to-firebase'
      }
    );
    replicationState.reSync();
  }

}