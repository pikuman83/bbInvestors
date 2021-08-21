import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { News } from '../modules/static-content/news/news.component';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  private dbPath = '/news';

  objectRef: AngularFirestoreCollection<News>;

  constructor(private db: AngularFirestore) {
    this.objectRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<News> {
    return this.objectRef;
  }

  create(news: News): any {
    return this.objectRef.add({ ...news });
  }

  update(id: string, data: any): Promise<void> {
    return this.objectRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.objectRef.doc(id).delete();
  }
}
