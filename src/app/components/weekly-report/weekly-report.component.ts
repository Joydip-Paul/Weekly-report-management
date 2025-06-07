import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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


  @ViewChild('pdfContent') pdfContent!: ElementRef;

  downloadPDF() {
    const data = this.pdfContent.nativeElement;

    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('weekly-report.pdf');
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
        this.onMemberDeleted();
      }
    });
  }

  onMemberDeleted(): void {
    this.loadMembers();
  }
}