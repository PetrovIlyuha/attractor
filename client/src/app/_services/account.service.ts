import { User } from './../_models/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(`${this.baseUrl}/account/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) this.setCurrentUser(user);
        return user;
      })
    );
  }

  register(model: any) {
    return this.http.post(`${this.baseUrl}/account/register`, model).pipe(
      map((user: User) => {
        if (user) this.setCurrentUser(user);
      })
    );
  }

  setCurrentUser(user: User) {
    console.log({ user });
    console.log({ token: user.token });

    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    if (Array.isArray(roles)) {
      user.roles = roles;
    } else {
      user.roles = [roles];
    }
    user.roles = roles;
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
