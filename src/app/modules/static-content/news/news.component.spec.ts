import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../shared/services/auth.service';

import { NewsComponent } from './news.component';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        MatDialogModule
      ],
      declarations: [ NewsComponent ],
      providers: [AuthService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // must show all the news
  // must make only one call
  // must show admin panel if admin
  // show panel must fail if not admin
  // must focus correctly on edit
  // must send edit request
  // must update on edit
  // calls must be made only once
  // must prompt and delete
  // delete should also send delete image request
  // must create new, scroll to top and confirm or show error
  // edit/new must be disntiguished without any error

});
