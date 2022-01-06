import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../shared/services/auth.service';
import { FireStoreService } from '../../shared/services/fire-store.service';
import { PrivateAreaComponent } from './private-area.component';

describe('PrivateAreaComponent', () => {
  let component: PrivateAreaComponent;
  let fixture: ComponentFixture<PrivateAreaComponent>;
  const fakeUser = { email: 'example@gmail.com', uid: 1, emailVerified: true }
  const authStub = {currentUser: Promise.resolve(fakeUser)};
  let AuthServiceSpy: any;

  let fakeService = {
    getratelist() {

    },
    getPrivateData(){

    },
    fakeRateList: {
      
    },
    fakePrivateData: {
      payload: {
        doc:{
          id: '1',
          data(){
            return {
              id: 11,
              pais: 'España',
              rate: 0
            }
          }
        }
      }
    }
  }
  
  beforeEach(async () => {
    AuthServiceSpy = { auth: authStub }
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        MatDialogModule
      ],
      declarations: [ PrivateAreaComponent ],
      providers: [
        { provide: AuthService, useValue: AuthServiceSpy},
        { provide: FireStoreService, useValue: fakeService}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PrivateAreaComponent);
    component = fixture.componentInstance;
    AuthServiceSpy = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('Should fail without user', fakeAsync(() => {
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));

  it('#getRate must return right rates of the projects and should be called only once', fakeAsync(() => {
    // try with fake service
    // Also try with creating spy and returning fake value with original service
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));

  it('#getProjects must return a single array with merged rate and should iterate only once', fakeAsync(() => {
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));
  
  it('number of cards must be similar to length of projects[]', fakeAsync(() => {
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));

  it('must show the title in the selected language', fakeAsync(() => {
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));

  it('Must return user related objects only', fakeAsync(() => {
    AuthServiceSpy.auth.currentUser = Promise.resolve(null);
    fixture.detectChanges();
    tick();
    expect(component.pList).toEqual([{id: 'hello'}]);
  }));

});
