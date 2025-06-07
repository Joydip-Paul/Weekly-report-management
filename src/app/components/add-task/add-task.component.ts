import { Component, Input } from '@angular/core';
import { Task } from '../../models/employee.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzSliderModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  @Input() memberIndex!: number;
  taskForm = this.fb.group({
    module: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    priority: this.fb.nonNullable.control<'Low' | 'Medium' | 'High'>('Medium'),
    completed: this.fb.nonNullable.control(0),
    blocker: this.fb.nonNullable.control('')
  });


  constructor(private fb: FormBuilder) { }


  submit(): void {
    if (this.taskForm.valid) {
      const data = localStorage.getItem('teamMembers');
      const members = data ? JSON.parse(data) : [];
      const raw = this.taskForm.getRawValue();
      const task: Task = {
        module: raw.module,
        description: raw.description,
        priority: raw.priority,
        completed: raw.completed,
        blocker: raw.blocker || ''
      };
      members[this.memberIndex].tasks = members[this.memberIndex].tasks || [];
      members[this.memberIndex].tasks.push(task);
      localStorage.setItem('teamMembers', JSON.stringify(members));
    }
  }

}
