import { MessageService } from './../../_services/message.service';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  clockIcon = faClock;
  @Input() messages: Message[];

  constructor() {}

  ngOnInit(): void {}
}
