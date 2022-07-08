import { BehaviorSubject, take } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './pagination.helper';
import { Message } from '../_models/message';
import { User } from '../_models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private readonly http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/messages?user=${otherUsername}`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((err) => console.error(err));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });
    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        console.log({ oldMessages: messages });
        console.log({ newMessag: message });

        this.messageThreadSource.next([...messages, message]);
      });
    });
  }

  stopMessageHubConnection() {
    if (this.hubConnection) this.hubConnection.stop();
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(
      'messages',
      params,
      this.http,
      this.baseUrl
    );
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      `${this.baseUrl}/messages/thread/${username}`
    );
  }

  async sendMessage(recepientUsername: string, content: string) {
    return this.hubConnection
      .invoke('SendMessage', {
        recepientUsername,
        content,
      })
      .catch((e) => console.error(e));
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
