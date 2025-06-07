// task-list.component.ts
import { Component, Input, inject } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Member } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() member!: Member;
  @Input() index!: number;

  private drawerService = inject(NzDrawerService);

  openTaskForm(): void {
    this.drawerService.create({
      nzTitle: 'Add New Task',
      nzClosable: true,
      nzWrapClassName: 'md-drawer calc-body',
      nzContent: AddTaskComponent,
      nzContentParams: {
        memberIndex: this.index
      }
    }).afterClose.subscribe(() => {
      // Reloading from parent will be handled there
    });
  }
}
