import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private readonly http: HttpClient) {}

  registerFormShown: boolean = false;
  users: any;

  ngOnInit(): void {}

  toggleRegisterForm(): void {
    this.registerFormShown = !this.registerFormShown;
  }

  closeRegisterForm(event: boolean) {
    this.registerFormShown = event;
  }
}
