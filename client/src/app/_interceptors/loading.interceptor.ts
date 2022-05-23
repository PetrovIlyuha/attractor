import { LatencyService } from './../_services/latency.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private latencyService: LatencyService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.latencyService.networkIsCongested();
    return next.handle(request).pipe(
      delay(400),
      finalize(() => {
        this.latencyService.networkClear();
      })
    );
  }
}
