import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() closeForm = new EventEmitter();

  constructor(private readonly accountService: AccountService) {}

  model: any = {};

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.cancelRegistration();
      },
      error: (err) => console.log(err),
    });
  }

  cancelRegistration() {
    this.closeForm.emit(false);
  }
}
