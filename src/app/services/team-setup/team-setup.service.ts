import { Injectable } from '@angular/core';
import { TeamConfig } from '../../models/team.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamSetupService {

  private defaultConfig: TeamConfig = {
    teamName: 'Web Development',
    submittedBy: 'Team Lead',
    weekStartDate: this.getCurrentWeekStart(),
    weekEndDate: this.getCurrentWeekEnd(),
    reportTitle: '📋 Weekly Team Report'
  };

  private configSubject = new BehaviorSubject<TeamConfig>(this.getStoredConfig());
  public config$ = this.configSubject.asObservable();

  constructor() {
    // Initialize with stored config or default
    this.loadConfig();
  }

  getConfig(): TeamConfig {
    return this.configSubject.value;
  }

  updateConfig(config: Partial<TeamConfig>): void {
    const currentConfig = this.getConfig();
    const updatedConfig = { ...currentConfig, ...config };
    this.configSubject.next(updatedConfig);
    this.saveConfig(updatedConfig);
  }

  private loadConfig(): void {
    const stored = this.getStoredConfig();
    this.configSubject.next(stored);
  }

  private getStoredConfig(): TeamConfig {
    try {
      const stored = localStorage.getItem('teamConfig');
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        return { ...this.defaultConfig, ...parsedConfig };
      }
    } catch (e) {
      console.error('Error loading team config:', e);
    }
    return this.defaultConfig;
  }

  private saveConfig(config: TeamConfig): void {
    try {
      localStorage.setItem('teamConfig', JSON.stringify(config));
    } catch (e) {
      console.error('Error saving team config:', e);
    }
  }

  private getCurrentWeekStart(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(today.setDate(diff));
    return this.formatDate(monday);
  }

  private getCurrentWeekEnd(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 5); // Adjust for Friday end
    const friday = new Date(today.setDate(diff));
    return this.formatDate(friday);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
