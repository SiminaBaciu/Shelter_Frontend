import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from './chat.service';
import { User } from '../users/users.service';
import { AuthService } from '../auth.service';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './adminChat.component.html',
  styleUrls: ['./adminChat.component.css']
})
export class AdminChatComponent implements OnInit, OnDestroy {
  activeChats: { [userId: number]: { user: User, messages: any[], newMessage: string, isTyping: boolean } } = {};
  isUserTyping!: boolean;
  
  constructor(
    private chatService: ChatService,
    private sharedService: SharedService,
    public authService: AuthService, 
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.sharedService.currentUser.subscribe(user => {
      if (user) {
        if (!this.activeChats[user.id]) {
          this.activeChats[user.id] = { user, messages: [], newMessage: '', isTyping: false };
        }

        this.subscribeToMessages(user.id);
        this.subscribeToTyping(user.id);
      }
    });

    this.chatService.connect();
  }

  subscribeToMessages(userId: number): void {
    this.chatService.onMessage().subscribe((message) => {
      if (message && message.senderId === userId) {
        this.handleIncomingMessage(userId, message);
      }
    });
  }

  subscribeToTyping(userId: number): void {
    this.chatService.subscribeToTyping(userId).subscribe(typingInfo => {
      if (typingInfo && typingInfo.senderId == userId) { 
        this.handleTypingStatus(userId, typingInfo.isTyping);
      }
    });
  }
handleTypingStatus(userId: number, isTyping: boolean): void {
  console.log(`Typing status received for user ${userId}: ${isTyping}`);
  if (this.activeChats[userId]) {
    console.log(`Updating typing status for user ${userId} to ${isTyping}`);
    this.activeChats[userId].isTyping = isTyping;
    console.log(this.activeChats[userId]); 
    this.changeDetector.detectChanges();
  }
}



  handleIncomingMessage(userId: number, message: any): void {
    if (this.activeChats[userId]) {
      this.activeChats[userId].messages.push(message);
      this.changeDetector.detectChanges();
    }
  }



  sendMessage(userId: number): void {
    const chatSession = this.activeChats[userId];
    if (!chatSession) {
      alert("No active chat selected.");
      return;
    }

    const message = {
      content: chatSession.newMessage,
      receiverId: userId,
      senderId: this.authService.getUserId(),
    };

    this.chatService.sendMessage('/app/chat.sendToUser', message);
    chatSession.messages.push(message);
    chatSession.newMessage = '';
    this.changeDetector.detectChanges();
  }

  getActiveChatIds(): number[] {
    return Object.keys(this.activeChats).map(id => parseInt(id));
  }

  closeChat(userId: number): void {
    delete this.activeChats[userId];
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
