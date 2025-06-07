import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamSetupService } from '../../services/team-setup/team-setup.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { DrawerResult } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-team-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzDatePickerModule],
  templateUrl: './team-setting.component.html',
  styleUrl: './team-setting.component.scss'
})
export class TeamSettingComponent {
  settingsForm: FormGroup = this.fb.group({
    reportTitle: ['' as string | null, Validators.required],
    teamName: ['' as string | null, Validators.required],
    submittedBy: ['' as string | null, Validators.required],
    weekStartDate: [null as Date | null, Validators.required],
    weekEndDate: [null as Date | null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private teamConfigService: TeamSetupService,
    private drawerRef: NzDrawerRef<DrawerResult>,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    const config = this.teamConfigService.getConfig();

    // Parse date strings to Date objects
    const startDate = this.parseDate(config.weekStartDate);
    const endDate = this.parseDate(config.weekEndDate);

    this.settingsForm.patchValue({
      reportTitle: config.reportTitle || '',
      teamName: config.teamName,
      submittedBy: config.submittedBy,
      weekStartDate: startDate,
      weekEndDate: endDate
    });
  }

  // Helper method to parse date strings
  private parseDate(dateStr: string): Date {
    try {
      return new Date(dateStr);
    } catch (e) {
      return new Date(); // Return current date as fallback
    }
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      const formValue = this.settingsForm.value;

      // Format dates properly
      const startDate = formValue.weekStartDate ?
        this.formatDate(formValue.weekStartDate) :
        this.formatDate(new Date());

      const endDate = formValue.weekEndDate ?
        this.formatDate(formValue.weekEndDate) :
        this.formatDate(new Date());

      const config = {
        reportTitle: formValue.reportTitle || '📋 Weekly Team Report',
        teamName: formValue.teamName || 'Team',
        submittedBy: formValue.submittedBy || 'Team Lead',
        weekStartDate: startDate,
        weekEndDate: endDate
      };

      this.teamConfigService.updateConfig(config);
      this.message.success('Team settings updated successfully!');
      this.drawerRef.close({ success: true, action: 'update' });
    }
  }

  // Helper method to format dates consistently
  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
