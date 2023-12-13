import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<string | null>(null);

  initializeWebSocketConnection(): void {
    const ws = new SockJS('http://localhost:8083/websocket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/notifications', (message: { body: string | null; }) => {
        if (message.body) {
            console.log("Received notification:", message.body);
            this.notificationsSubject.next(message.body);
        }
      });
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe('/topic/notifications', (message: { body: string | null; }) => {
          if (message.body) {
            this.notificationsSubject.next(message.body);
          }
        });
      });
    });
  }

  get notifications() {
    return this.notificationsSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
  
}
