import { Member } from './../../_models/member.interface';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user.interface';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [
    { value: 'male', displayValue: 'Men' },
    { value: 'female', displayValue: 'Women' },
  ];

  constructor(private readonly membersService: MembersService) {
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }

  resetFilters() {
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }
}
