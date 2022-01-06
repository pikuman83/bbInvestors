import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NewsAdminComponent } from './news-admin.component';

describe('NewsAdminComponent', () => {
  let component: NewsAdminComponent;
  let fixture: ComponentFixture<NewsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:  [ReactiveFormsModule],
      declarations: [ NewsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // first field should be focused upon expand
  // if form.invalid, create should be disable
  // reset should reset form and edit field
  // validations should work as expected
  // must load fields if edit event is recieved
  // must distinguish if edit or new and send event accordingly

});
