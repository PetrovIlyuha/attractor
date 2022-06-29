import { User } from './../_models/user.interface';
import { AccountService } from './account.service';
import { Member } from './../_models/member.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, of, take, ReplaySubject } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  user: User;
  userParams: UserParams;
  private likedUsersNames = new ReplaySubject<string[]>();
  likedUsers$ = this.likedUsersNames.asObservable();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  members: Member[] = [];
  memberCache = new Map();

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    let response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>('appusers', params).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((all, next) => all.concat(next.result), [])
      .find((m: Member) => m.username === username);

    if (member) {
      return of(member);
    }

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

  setPhotoAsMain(photoId: number) {
    return this.http.put(
      `${this.baseUrl}/appusers/set-main-photo/${photoId}`,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(
      `${this.baseUrl}/appusers/delete-photo/${photoId}`,
      {}
    );
  }

  addLike(username: string) {
    return this.http.post(`${this.baseUrl}/likes/${username}`, {}).pipe(
      map((response) => {
        this.getAllLikesWithNoPagination().subscribe((value) => {
          console.log('likes are updated');
        });
        return response;
      })
    );
  }

  getLikes(predicate: string, pageNumber: number = 1, pageSize: number = 5) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResult<Partial<Member[]>>(`likes`, params);
  }

  getAllLikesWithNoPagination() {
    console.log('all likes request');
    return this.http.get(`${this.baseUrl}/likes/all`).pipe(
      map((usernames: string[]) => {
        this.likedUsersNames.next(usernames);
        return usernames;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http
      .get<T>(`${this.baseUrl}/${url}`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }
}
