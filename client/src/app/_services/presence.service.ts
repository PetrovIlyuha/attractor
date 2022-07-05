import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private notifications: ToastrService) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/presence`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('hub is connected');
      })
      .catch((err) => console.error(err));
    this.hubConnection.on('UserIsOnline', (username) => {
      this.notifications.info(`${username} in online`);
    });
    this.hubConnection.on('UserIsOffline', (username) => {
      this.notifications.warning(`${username} in offline`);
    });
    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    });
  }

  stopHubConnection() {
    this.hubConnection.stop().catch((err) => console.error(err));
  }
}
