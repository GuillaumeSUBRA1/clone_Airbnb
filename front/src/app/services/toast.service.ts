import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  INIT = "INIT";

  private sendSubject = new BehaviorSubject<Message>({ summary: this.INIT });
  sendObservable = this.sendSubject.asObservable();

  send(msg: Message) {
    this.sendSubject.next(msg);
  }
}
