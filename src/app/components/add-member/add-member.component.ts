import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Member, MemberRole } from '../../models/employee.model';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent {
  memberForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: [MemberRole.Developer]
  });

  constructor(private fb: FormBuilder) { }

  submit(): void {
    if (this.memberForm.valid) {
      const newMember: Member = this.memberForm.value as Member;
      const stored = localStorage.getItem('teamMembers');
      const members: Member[] = stored ? JSON.parse(stored) : [];
      members.push(newMember);
      localStorage.setItem('teamMembers', JSON.stringify(members));
      console.log('Saved Member:', newMember);
      this.memberForm.reset();
    }
  }
}
