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

  constructor(private modalService: NzModalService, private message: NzMessageService) {

  }

  ngOnInit(): void {
    this.loadMembers();
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


  onMemberDeleted(): void {
    this.loadMembers();
  }
}