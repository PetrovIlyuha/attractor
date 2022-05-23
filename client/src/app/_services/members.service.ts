import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Member } from '../_models/member.interface';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  members: Member[] = [];

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(`${this.baseUrl}/appusers`).pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find((m) => m.username === username);
    if (member) return of(member);
    return this.http.get<Member>(
      `${this.baseUrl}/appusers/username/${username}`
    );
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/appusers`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
