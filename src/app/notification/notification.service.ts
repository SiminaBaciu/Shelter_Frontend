import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private zone: NgZone) {}

  stream(): Observable<string> {
    return new Observable<string>((observer) => {
      // ✅ IMPORTANT: use nginx route so no CORS issues
      // nginx should proxy /api/notifications/** -> user-service
      const url = `/api/notifications/stream`;

      console.log('SSE connect:', url);

      const es = new EventSource(url);

      // ✅ handle default SSE messages (event name "message")
      es.onmessage = (event) => {
        this.zone.run(() => {
          console.log('SSE message:', event.data);
          observer.next(event.data);
        });
      };

      // ✅ handle named events: event: notification
      es.addEventListener('notification', (event: any) => {
        this.zone.run(() => {
          console.log('SSE notification:', event.data);
          observer.next(event.data);
        });
      });

      // ✅ DON'T observer.error() here, browser retries SSE automatically.
      es.onerror = (err) => {
        console.warn('SSE error (browser will retry automatically):', err);
        // keep connection open; do not close unless you want to stop forever
      };

      return () => {
        console.log('SSE closed');
        es.close();
      };
    });
  }
}
