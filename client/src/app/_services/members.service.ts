import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../_models/member.interface';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}/appusers`);
  }

  getMember(username: string) {
    return this.http.get<Member>(
      `${this.baseUrl}/appusers/username/${username}`
    );
  }
}
