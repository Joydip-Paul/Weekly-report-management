import { Component, Input } from '@angular/core';
import { Task } from '../../models/employee.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzSliderModule, NzMessageModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  @Input() memberIndex!: number;
  @Input() task?: Task;
  @Input() isEdit: boolean = false;

  taskForm = this.fb.group({
    module: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    priority: this.fb.nonNullable.control<'Low' | 'Medium' | 'High'>('Medium'),
    completed: this.fb.nonNullable.control(0),
    blocker: this.fb.nonNullable.control('')
  });

  constructor(
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    if (this.isEdit && this.task) {
      this.taskForm.patchValue({
        module: this.task.module,
        description: this.task.description,
        priority: this.task.priority,
        completed: this.task.completed,
        blocker: this.task.blocker || ''
      });
    }
  }

  get formTitle(): string {
    return this.isEdit ? 'Edit Task' : 'Add New Task';
  }

  get submitButtonText(): string {
    return this.isEdit ? 'Update Task' : 'Add Task';
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  submit(): void {
    if (this.taskForm.valid) {
      try {
        const data = localStorage.getItem('teamMembers');
        const members = data ? JSON.parse(data) : [];
        const raw = this.taskForm.getRawValue();

        if (this.isEdit && this.task) {
          const taskIndex = members[this.memberIndex].tasks.findIndex((t: Task) => t.id === this.task!.id);

          if (taskIndex !== -1) {
            const updatedTask: Task = {
              id: this.task.id,
              module: raw.module,
              description: raw.description,
              priority: raw.priority,
              completed: raw.completed,
              blocker: raw.blocker || ''
            };

            members[this.memberIndex].tasks[taskIndex] = updatedTask;
            localStorage.setItem('teamMembers', JSON.stringify(members));

            this.message.success('Task updated successfully!');
            this.drawerRef.close({ success: true, action: 'edit' });
          }
        } else {
          const newTask: Task = {
            id: this.generateId(),
            module: raw.module,
            description: raw.description,
            priority: raw.priority,
            completed: raw.completed,
            blocker: raw.blocker || ''
          };

          members[this.memberIndex].tasks = members[this.memberIndex].tasks || [];
          members[this.memberIndex].tasks.push(newTask);
          localStorage.setItem('teamMembers', JSON.stringify(members));

          this.message.success('Task added successfully!');
          this.drawerRef.close({ success: true, action: 'add' });
        }
      } catch (error) {
        this.message.error(`Failed to ${this.isEdit ? 'update' : 'add'} task. Please try again.`);
      }
    }
  }
}
