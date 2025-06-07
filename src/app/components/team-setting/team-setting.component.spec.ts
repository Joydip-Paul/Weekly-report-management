import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSettingComponent } from './team-setting.component';

describe('TeamSettingComponent', () => {
  let component: TeamSettingComponent;
  let fixture: ComponentFixture<TeamSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
