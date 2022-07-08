import { MessageService } from './../../_services/message.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  clockIcon = faClock;
  @Input() messages: Message[];
  @Input() recepientUsername: string;
  content: string;

  constructor(public messagesService: MessageService) {}

  ngOnInit(): void {}

  sendMessage() {
    this.messagesService
      .sendMessage(this.recepientUsername, this.content)
      .then(() => {
        this.messageForm.reset();
      });
  }
}
