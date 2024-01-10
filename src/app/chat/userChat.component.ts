import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { SharedService } from './shared.service';
import { AuthService } from '../auth.service';
import { User } from '../users/users.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './userChat.component.html',
  styleUrls: ['./userChat.component.css']
})
export class UserChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string | undefined;
  selectedUser: User | null = null;

  constructor(
    private chatService: ChatService, 
    private sharedService: SharedService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentUser.subscribe(user => {
      this.selectedUser = user;
      console.log("Selected user from shared service:", this.selectedUser);
    });

    this.chatService.connect();
    this.chatService.onMessage().subscribe((message) => {
      if (message) {
        this.handleIncomingMessage(message);
      }
    });
  }

  handleIncomingMessage(message: any): void {
    if (message.receiverId.toString() === this.authService.getUserId()?.toString()) {
      this.messages.push(message);
      console.log("Message added to user chat:", message);
    } else {
      console.log("Received message not for this user:", message);
    }
  }

  sendMessage(): void {
    const message = {
      content: this.newMessage,
      receiverId: '6', 
      senderId: this.authService.getUserId(),
    };

    this.chatService.sendMessage('/app/chat.sendToAdmin', message);
    this.messages.push(message);
    this.newMessage = '';
  }


onInputChange(): void {
  const typingMessage = {
    senderId: this.authService.getUserId()?.toString(),
    isTyping: true
  };


  this.chatService.sendMessage('/app/chat.typing', typingMessage); 


  setTimeout(() => {
    const stopTypingMessage = {
      senderId: this.authService.getUserId()?.toString(),
      isTyping: false
    };
    this.chatService.sendMessage('/app/chat.typing', stopTypingMessage); 
  }, 3000);
}


  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
