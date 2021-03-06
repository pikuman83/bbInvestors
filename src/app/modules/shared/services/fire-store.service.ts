import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Projects, rateList } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(private db: AngularFirestore) {}

  getAll(path: string): AngularFirestoreCollection<any> {
    return this.db.collection(`/${path}`, path === 'projects'? ref => ref.where('public', '==', true).orderBy('time', 'desc'): ref => ref.orderBy('time', 'desc'));
  }
  getProjectsAdmin(): AngularFirestoreCollection<any> {
    return this.db.collection('projects', ref => ref.orderBy('time', 'desc'));
  }
  getPrivateData(uid: string): AngularFirestoreCollection<Projects> {
    return this.db.collection('projects', ref => ref.where('user', '==', uid));
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
  getUsers(): AngularFirestoreCollection<any> {
    return this.db.collection('users');
  }
  // the app allows a quotation per project and user and not ONLY per user (means single price per project)
  getRateList(pid: string, id: string): AngularFirestoreCollection<rateList> {
    return this.db.collection<rateList>('/rateList', 
      ref => ref.where('user', '==', id)
      .where('pid', '==', pid));
  }
  getRateListAdmin(pid: string): AngularFirestoreCollection<rateList> {
    return this.db.collection<rateList>('/rateList', 
      ref => ref.where('pid', '==', pid));
  }
  updateRateList(pid: string, data: rateList): Promise<void> {
    return this.db.collection('/rateList').doc(pid).update(data);
  }
  deleteRatelist(pid: string): Promise<void>  {
    return this.db.collection('/rateList').doc(pid).delete();
  }
  getNewsPartial(): AngularFirestoreCollection<Projects> {
    return this.db.collection('news', ref => ref.limit(3));
  }
  
}