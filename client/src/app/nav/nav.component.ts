import { User } from 'src/app/_models/user.interface';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import {
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  faEllipsis = faEllipsisVertical;
  showPasswordIcon = faEye;
  hidePasswordIcon = faEyeSlash;
  bellIcon = faBell;
  checkPasswordIcon = this.showPasswordIcon;
  passwordFieldType: 'password' | 'text' = 'password';
  model: any = {};
  currentUser$: Observable<User>;
  user: User;
  menuIconAnimating: boolean = false;
  constructor(
    private readonly accountService: AccountService,
    public readonly messageService: MessageService,
    private router: Router,
    private readonly toastNotifier: ToastrService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.checkPasswordIcon =
      this.passwordFieldType === 'password'
        ? this.showPasswordIcon
        : this.hidePasswordIcon;
  }

  enableMenuIconAnimation() {
    this.menuIconAnimating = true;
    setTimeout(() => {
      this.menuIconAnimating = false;
    }, 1200);
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        this.toastNotifier.success(`Welcome, ${response.username}!`);
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        // this.toastNotifier.error(error.error);
        console.log(error);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
