import { TestBed } from '@angular/core/testing';

import { TeamSetupService } from './team-setup.service';

describe('TeamSetupService', () => {
  let service: TeamSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
