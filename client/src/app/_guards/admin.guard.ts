import { AccountService } from 'src/app/_services/account.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private notifications: ToastrService
  ) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
          return true;
        }
        this.notifications.error("You can't visit this area of the site!");
      })
    );
  }
}
