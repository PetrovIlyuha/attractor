import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import {
  faEllipsisVertical,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { User } from '../_models/user.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  faEllipsis = faEllipsisVertical;
  showPasswordIcon = faEye;
  hidePasswordIcon = faEyeSlash;
  checkPasswordIcon = this.showPasswordIcon;
  passwordFieldType: 'password' | 'text' = 'password';
  model: any = {};
  currentUser$: Observable<User>;
  menuIconAnimating: boolean = false;
  constructor(
    private readonly accountService: AccountService,
    private router: Router,
    private readonly toastNotifier: ToastrService
  ) {}

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
