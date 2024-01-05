import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private messageSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  // Connect to the WebSocket server
  connect(): void {
    const serverUrl = 'http://localhost:8084/ws'; // Change to your server URL
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    const headers = { Authorization: 'Bearer ' + this.authService.getUserValue().token }; // Include JWT token

    this.stompClient.connect(headers, () => {
      // Subscribe to your queue
      this.stompClient.subscribe(`/user/queue/messages`, (message: { body: string; }) => {
        if (message.body) {
          this.messageSubject.next(JSON.parse(message.body));
        }
      });
    });
  }

  // Send message to the server
  sendMessage(message: any): void {
    this.stompClient.send('/app/chat.private', {}, JSON.stringify(message));
  }

  // Observable to allow components to subscribe to new messages
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Disconnect the WebSocket connection
  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}
