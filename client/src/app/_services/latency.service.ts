import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LatencyService {
  inProgressRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  networkIsCongested() {
    this.inProgressRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: '#fff',
      color: '#333',
    });
  }

  networkClear() {
    this.inProgressRequestCount--;
    if (this.inProgressRequestCount <= 0) {
      this.inProgressRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
