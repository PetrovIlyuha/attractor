import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() closeForm = new EventEmitter();

  constructor(
    private readonly accountService: AccountService,
    private readonly toastNotifier: ToastrService
  ) {}

  model: any = {};

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        this.cancelRegistration();
      },
      error: ({ error }) => {
        if (typeof error === 'string') {
          this.toastNotifier.error(error);
        } else {
          let errorsOccurred = Object.values(error.errors).flat();
          for (let error of errorsOccurred) {
            this.toastNotifier.error(error as string);
          }
        }
      },
    });
  }

  cancelRegistration() {
    this.closeForm.emit(false);
  }
}
