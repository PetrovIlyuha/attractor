import { AccountService } from './_services/account.service';
import { User } from './_models/user.interface';
import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly accountService: AccountService) {
    setTheme('bs4');
  }
  users: any;

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }
}
