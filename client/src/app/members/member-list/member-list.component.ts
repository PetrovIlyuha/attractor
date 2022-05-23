import { Member } from './../../_models/member.interface';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;

  constructor(private readonly membersService: MembersService) {}

  ngOnInit(): void {
    this.members$ = this.membersService.getMembers();
  }
}
