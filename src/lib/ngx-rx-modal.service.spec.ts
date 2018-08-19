import { TestBed, inject } from '@angular/core/testing';

import { NgxRxModalService } from './ngx-rx-modal.service';

describe('NgxRxModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxRxModalService]
    });
  });

  it('should be created', inject([NgxRxModalService], (service: NgxRxModalService) => {
    expect(service).toBeTruthy();
  }));
});
