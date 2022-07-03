import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(
      `${this.apiUrl}/admin/users-with-roles`
    );
  }
}
