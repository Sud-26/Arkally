import { TestBed } from '@angular/core/testing';

import { SidemenuService } from './sidemenu.service';

describe('SidemenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidemenuService = TestBed.get(SidemenuService);
    expect(service).toBeTruthy();
  });
});
