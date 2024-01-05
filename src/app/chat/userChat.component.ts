import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
@Component({
  selector: 'app-user-chat',
  templateUrl: './userChat.component.html',
  styleUrls: []
})
export class UserChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string | undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.connect();
    this.chatService.onMessage().subscribe((message) => {
      if (message) {
        this.messages.push(message);
      }
    });
  }

  sendMessage(): void {
    const message = {
      content: this.newMessage,
      receiverId: 'admin' // Assuming 'admin' is the username of the admin
    };
    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
