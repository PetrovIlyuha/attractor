import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user.interface';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private toastNotifications: ToastrService
  ) {}
  user: User = null;

  registerFormShown: boolean = false;
  users: any;

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  toggleRegisterForm(): void {
    if (!this.registerFormShown && this.user) {
      this.toastNotifications.error('You are already logged in!');
      return;
    }
    this.registerFormShown = !this.registerFormShown;
  }

  closeRegisterForm(event: boolean) {
    this.registerFormShown = event;
  }
}
