import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor() { }

  startPolling(eventName: string) {
    const observable = Observable.create(observer => {
      const id = setInterval(() => {
        observer.next(eventName);
      }, 5000);
    });

    return observable;
  }
}
