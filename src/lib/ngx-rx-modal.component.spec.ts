import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRxModalComponent } from './ngx-rx-modal.component';

describe('NgxRxModalComponent', () => {
  let component: NgxRxModalComponent;
  let fixture: ComponentFixture<NgxRxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
