// task-list.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Member, Task } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzMessageModule, NzModalModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() member!: Member;
  @Input() index!: number;
  @Output() memberDeleted = new EventEmitter<number>();

  private drawerService = inject(NzDrawerService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  openTaskForm(): void {
    this.drawerService.create({
      nzTitle: 'Add New Task',
      nzClosable: true,
      nzWrapClassName: 'md-drawer calc-body',
      nzContent: AddTaskComponent,
      nzContentParams: {
        memberIndex: this.index,
        isEdit: false
      }
    }).afterClose.subscribe((result) => {
      if (result?.success) {
        this.reloadTasks();
      }
    });
  }

  editTask(task: Task): void {
    this.drawerService.create({
      nzTitle: 'Edit Task',
      nzClosable: true,
      nzWrapClassName: 'md-drawer calc-body',
      nzContent: AddTaskComponent,
      nzContentParams: {
        memberIndex: this.index,
        task: task,
        isEdit: true
      }
    }).afterClose.subscribe((result) => {
      if (result?.success) {
        this.reloadTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    this.modal.confirm({
      nzTitle: 'Delete Task',
      nzContent: `Are you sure you want to delete the task "${task.module}"?`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        try {
          const data = localStorage.getItem('teamMembers');
          if (!data) return;

          const members = JSON.parse(data);

          // Check if member and tasks exist
          if (!members[this.index] || !members[this.index].tasks) {
            this.message.error('Could not find tasks for this member.');
            return;
          }

          // Debug log to see what's happening
          console.log('Before delete:', JSON.stringify(members[this.index].tasks));
          console.log('Task to delete ID:', task.id);

          // Make sure we're only filtering tasks with the specific ID
          const updatedTasks = members[this.index].tasks.filter((t: Task) => {
            // Debug log to see each task being evaluated
            console.log('Comparing task ID:', t.id, 'with', task.id, 'Result:', t.id !== task.id);
            return t.id !== task.id;
          });

          // Debug log to see the result
          console.log('After delete:', JSON.stringify(updatedTasks));

          // Update the tasks array
          members[this.index].tasks = updatedTasks;

          // Save back to localStorage
          localStorage.setItem('teamMembers', JSON.stringify(members));

          // Reload tasks
          this.reloadTasks();
          this.message.success('Task deleted successfully!');
        } catch (error) {
          console.error('Delete error:', error);
          this.message.error('Failed to delete task. Please try again.');
        }
      }
    });
  }

  private reloadTasks(): void {
    const data = localStorage.getItem('teamMembers');
    const members = data ? JSON.parse(data) : [];
    if (members[this.index]) {
      this.member.tasks = members[this.index].tasks || [];
    }
  }

  deleteMember(): void {
    this.modal.confirm({
      nzTitle: 'Delete Member',
      nzContent: `Are you sure you want to delete ${this.member.name}? This will also delete all associated tasks.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        try {
          const data = localStorage.getItem('teamMembers');
          if (!data) return;

          const members = JSON.parse(data);

          // Remove the member at the specified index
          members.splice(this.index, 1);

          // Save back to localStorage
          localStorage.setItem('teamMembers', JSON.stringify(members));

          // Emit event to parent component to refresh the list
          this.memberDeleted.emit(this.index);

          // Show success message
          this.message.success(`${this.member.name} has been deleted successfully.`);
        } catch (error) {
          console.error('Error deleting member:', error);
          this.message.error('Failed to delete member. Please try again.');
        }
      }
    });
  }
}
