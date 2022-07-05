import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member.interface';

import { faUser, faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  userIcon = faUser;
  messageIcon = faEnvelope;
  heartIcon = faHeart;
  @Input() member: Member;
  @Input() likedUsers: string[];
  constructor(
    private membersService: MembersService,
    private toastNotifications: ToastrService,
    public presence: PresenceService
  ) {}

  addLike() {
    this.membersService
      .addLike(this.member.username)
      .subscribe((response: any) => {
        this.toastNotifications.success(response.value);
      });
  }

  isMemberLiked(memberAlias: string) {
    if (this.likedUsers) {
      return this.likedUsers.findIndex((m) => m === memberAlias) > 0;
    } else {
      return false;
    }
  }

  ngOnInit(): void {}
}
