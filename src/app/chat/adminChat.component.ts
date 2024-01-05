import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './adminChat.component.html',
  styleUrls: []
})
export class AdminChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage!: string;
  selectedUserId!: string;

  constructor(private chatService: ChatService, private authService: AuthService) {}

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
      receiverId: this.selectedUserId
    };
    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
