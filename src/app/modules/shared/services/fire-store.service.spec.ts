import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

import { FireStoreService } from './fire-store.service';

describe('FireStoreService', () => {
  let service: FireStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [{AngularFirestore, useValue: {}}]
    });
    service = TestBed.inject(FireStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
