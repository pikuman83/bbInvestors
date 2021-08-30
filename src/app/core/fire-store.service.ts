import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(private db: AngularFirestore) {}

  getAll(path: string): AngularFirestoreCollection<any> {
    return this.db.collection(`/${path}`);
  }

  get(path: string, documentId: string) {
    return this.db.collection(`/${path}`).doc(documentId);
  }

  create(path: string, data: any): any {
    return this.db.collection(`/${path}`).add({ ...data });
  }

  update(path: string, id: string, data: any): Promise<void> {
    return this.db.collection(`/${path}`).doc(id).update(data);
  }

  delete(path: string, id: string): Promise<void> {
    return this.db.collection(`/${path}`).doc(id).delete();
  }
  
}