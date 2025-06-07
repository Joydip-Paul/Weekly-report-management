import { Component, OnInit, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddMemberComponent } from '../add-member/add-member.component';
import { CommonModule } from '@angular/common';
import { DrawerResult, Member } from '../../models/employee.model';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskListComponent } from "../task-list/task-list.component";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamSettingComponent } from '../team-setting/team-setting.component';
import { TeamConfig } from '../../models/team.model';
import { TeamSetupService } from '../../services/team-setup/team-setup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weekly-report',
  standalone: true,
  imports: [NzButtonModule, NzDrawerModule, NzIconModule, CommonModule, NzSelectModule, TaskListComponent],
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.scss']
})
export class WeeklyReportComponent implements OnInit {
  members: Member[] = [];
  private drawerService = inject(NzDrawerService);
  teamConfig: TeamConfig = {} as TeamConfig;
  private configSubscription?: Subscription;

  constructor(private modalService: NzModalService, private message: NzMessageService, private teamConfigService: TeamSetupService) {

  }

  ngOnInit(): void {
    this.loadMembers();

    this.configSubscription = this.teamConfigService.config$.subscribe(config => {
      this.teamConfig = config;
    });
  }

  openAddMember(): void {
    const drawerRef = this.drawerService.create<AddMemberComponent, any, DrawerResult>({
      nzTitle: 'Add Member',
      nzClosable: true,
      nzWrapClassName: 'sm-drawer calc-body',
      nzContent: AddMemberComponent
    })

    drawerRef.afterClose.subscribe((result: DrawerResult | undefined) => {
      if (result?.success) {
        this.loadMembers();
      }
    });
  }

  private loadMembers(): void {
    const data = localStorage.getItem('teamMembers');
    this.members = data
      ? JSON.parse(data).map((m: Member) => ({
        ...m,
        tasks: m.tasks ?? []
      }))
      : [];
  }


  openTeamSettings(): void {
    const drawerRef = this.drawerService.create<TeamSettingComponent, any, DrawerResult>({
      nzTitle: 'Team Settings',
      nzClosable: true,
      nzWrapClassName: 'md-drawer calc-body',
      nzContent: TeamSettingComponent
    });

    drawerRef.afterClose.subscribe((result: DrawerResult | undefined) => {
      if (result && result.success) {
        // Config will be automatically updated via the service subscription
      }
    });
  }

  onMemberDeleted(): void {
    this.loadMembers();
  }
}