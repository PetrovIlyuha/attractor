import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;
  likedUsers$: Observable<string[]>;

  constructor(private membersService: MembersService) {
    this.likedUsers$ = this.membersService.likedUsers$;
  }

  ngOnInit(): void {
    this.loadLikes();
    this.membersService.getAllLikesWithNoPagination().subscribe();
  }

  loadLikes() {
    this.membersService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        console.log({ response });

        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
