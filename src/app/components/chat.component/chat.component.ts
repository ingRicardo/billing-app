import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private readonly chatService = inject(ChatService);

  userPrompt = signal<string>('');

  messages = this.chatService.messages;
  isTyping = this.chatService.isTyping;

  // Helper method for ngModelChange
  updatePrompt(val: string): void {
    this.userPrompt.set(val);
  }

  send(): void {
    const text = this.userPrompt().trim();
    if (!text || this.isTyping()) return;

    this.userPrompt.set('');
    this.chatService.sendMessage(text).subscribe();
  }

  clear(): void {
    this.chatService.clearChat();
  }
}