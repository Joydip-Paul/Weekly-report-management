import { Component, OnInit, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddMemberComponent } from '../add-member/add-member.component';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/employee.model';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-weekly-report',
  standalone: true,
  imports: [NzButtonModule, NzDrawerModule, NzIconModule, CommonModule, NzSelectModule],
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.scss']
})
export class WeeklyReportComponent implements OnInit {
  members: Member[] = [];
  private drawerService = inject(NzDrawerService);

  ngOnInit(): void {
    this.loadMembers();
  }

  openAddMember(): void {
    const drawerRef = this.drawerService.create<AddMemberComponent, any, void>({
      nzTitle: 'Add Member',
      nzClosable: true,
      nzWrapClassName: 'sm-drawer calc-body',
      nzContent: AddMemberComponent
    });

    drawerRef.afterClose.subscribe(() => {
      this.loadMembers();
    });
  }

  openTaskForm(index: number): void {
    this.drawerService.create({
      nzTitle: 'Add New Task',
      nzContent: AddTaskComponent,
      nzClosable: true,
      nzWrapClassName: 'md-drawer calc-body',
      nzContentParams: {
        memberIndex: index
      }
    }).afterClose.subscribe(() => this.loadMembers());
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

}