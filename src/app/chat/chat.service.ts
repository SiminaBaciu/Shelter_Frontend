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
  private typingSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) { }

  connect(): void {
    const serverUrl = 'http://localhost:8084/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    const headers = {
      Authorization: 'Bearer ' + this.authService.getUserValue().token,
    };

    this.stompClient.connect(headers, () => {
      const user = this.authService.getUserValue();
      const messageDestination = `/user/${user.id}/queue/messages`;
      this.stompClient.subscribe(messageDestination, (message: { body: string; }) => {
        this.messageSubject.next(JSON.parse(message.body));
      });

      const typingDestination =`/user/${6}/queue/typing`;
      this.stompClient.subscribe(typingDestination, (typing: { body: string; }) => {
        this.typingSubject.next(JSON.parse(typing.body));
      });
    });
  }

  sendMessage(destination: any, message: any): void {
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  onTyping(): Observable<any> {
    return this.typingSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }


  subscribe(destination: string): Observable<any> {
    this.stompClient.subscribe(destination, (message: any) => {
      if (message.body) {
        this.typingSubject.next(JSON.parse(message.body));
      }
    });
    return this.typingSubject.asObservable();
  }

  subscribeToTyping(userId: any): Observable<any> {
    const destination = `/user/${userId}/queue/typing`;
    this.stompClient.subscribe(destination, (typing: { body: string; }) => {
      const parsedBody = JSON.parse(typing.body);
      console.log(`Received typing info for user ${userId}:`, parsedBody);
      this.typingSubject.next(parsedBody);
    });
    return this.typingSubject.asObservable();
  }
  

  
}
