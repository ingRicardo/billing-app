import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ChatRequest, ChatResponse, ChatMessage } from '../models/chat.model';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  // Update to your ASP.NET Core backend or Vercel URL
  private readonly apiUrl = 'https://womenapi.onrender.com/api/chat/send'; 

  // Signal state management
  public messages = signal<ChatMessage[]>([]);
  public isTyping = signal<boolean>(false);

  sendMessage(userText: string): Observable<ChatResponse> {
    const trimmedText = userText.trim();
    if (!trimmedText) {
      return throwError(() => new Error('Message cannot be empty.'));
    }

    // Add user message to UI immediately
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: trimmedText,
      timestamp: new Date()
    };

    this.messages.update((prev) => [...prev, userMsg]);
    this.isTyping.set(true);

    const payload: ChatRequest = { message: trimmedText };

    return this.http.post<ChatResponse>(this.apiUrl, payload).pipe(
      tap({
        next: (response) => {
          // Add Gemini's reply from C# controller
          const botMsg: ChatMessage = {
            id: crypto.randomUUID(),
            sender: 'bot',
            text: response.reply, // Matches ChatResponse.Reply
            timestamp: new Date()
          };

          this.messages.update((prev) => [...prev, botMsg]);
          this.isTyping.set(false);
        },
        error: (err) => {
          this.isTyping.set(false);
          console.error('Chat API Error:', err);

          const errorMsg: ChatMessage = {
            id: crypto.randomUUID(),
            sender: 'bot',
            text: 'Sorry, I encountered an error generating a reply. Please try again.',
            timestamp: new Date()
          };
          this.messages.update((prev) => [...prev, errorMsg]);
        }
      })
    );
  }

  clearChat(): void {
    this.messages.set([]);
  }
}
