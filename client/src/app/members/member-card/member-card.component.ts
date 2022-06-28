import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member.interface';

import { faUser, faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  userIcon = faUser;
  contactIcon = faEnvelope;
  heartIcon = faHeart;
  @Input() member: Member;
  constructor(
    private membersService: MembersService,
    private toastNotifications: ToastrService
  ) {}

  addLike() {
    this.membersService.addLike(this.member.username).subscribe(() => {
      this.toastNotifications.success(`You've liked ${this.member.knownAs}`);
    });
  }

  ngOnInit(): void {}
}
