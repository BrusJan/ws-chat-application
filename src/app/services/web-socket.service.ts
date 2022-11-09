import { Injectable } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { ChatMessageDto } from '../models/chatMessageDto';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  webSocket: WebSocket;
  chatMessages: ChatMessageDto[] = [];
  websocketError = new ReplaySubject<string>(1);

  constructor() {}

  public openWebSocket() {
    try {
      this.webSocket = new WebSocket('ws://185.28.100.130:8080/chat');

      this.webSocket.onopen = (event) => {
        console.log('Open: ', event);
      };

      this.webSocket.onerror = (error) => {
        console.error(error);
        this.websocketError.next('some error');
      }

      this.webSocket.onmessage = (event) => {
        const chatMessageDto = JSON.parse(event.data);
        this.chatMessages.push(chatMessageDto);
      };

      this.webSocket.onclose = (event) => {
        console.log('Close: ', event);
      };
    } catch (e) {
      console.error(e);
      this.websocketError.next(e);
    }
  }

  public sendMessage(chatMessageDto: ChatMessageDto) {
    try {
      this.webSocket.send(JSON.stringify(chatMessageDto));
    } catch (e) {
      console.error(e);
      this.websocketError.next(e);
    }
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
