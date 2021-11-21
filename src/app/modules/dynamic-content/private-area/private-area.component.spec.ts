import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  const user = {
    uid:  'mockUser'
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        MatDialogModule
      ],
      declarations: [ PrivateAreaComponent ],
      providers: [AuthService, FireStoreService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    const service = TestBed.inject(AuthService);
    service.user = user;
    fixture = TestBed.createComponent(PrivateAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
