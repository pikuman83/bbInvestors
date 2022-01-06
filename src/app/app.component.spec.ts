import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuModule} from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { GlobalService } from './global.service';
import { AuthService } from './modules/shared/services/auth.service';

describe('AppComponent', () => {

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let isAdmin = new BehaviorSubject<boolean>(false);
  let authMock =  jasmine.createSpyObj('AuthService', ['isAdmin']);

  beforeEach(async () => {
    authMock.isAdmin = isAdmin;
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatMenuModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatMenu, useValue: {} },
        { provide: GlobalService},
        { provide: Document, useValue: {} },
        { provide: Renderer2, useValue: {} },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'bbInvestors'`, () => {
    expect(app.title).toEqual('bbInvestors');
  });

  it('Should check if the user is admin', () => {
    expect(app.isAdmin).toBe(false);
    authMock.isAdmin.next(true)
    app.ngOnInit();
    expect(app.isAdmin).toBe(true);
  });

  it('if landing page, home should hide itself', () => {
    expect(app.showMenu).toBeTruthy();
    fixture.detectChanges();
    let footer: HTMLElement = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
    let srv = TestBed.inject(GlobalService);
    srv.showMenu.next(false);
    fixture.detectChanges();
    expect(app.showMenu).toBeFalsy();
    setTimeout(() => {
      expect(footer).toBeFalsy();
    },1000);
  })

  // should show if is Admin
  // should show only login if not login and logout if logged in
  // should show private area if logged in
  // should show login dialogue box
  // logout
  // navbar open/close
  // navbar responsiveness
  // language
  // scroll


  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('bbInvestors app is running!');
  // });
});
