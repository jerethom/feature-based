import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrackByService {
  id<T>(index: number, input: { id: number | string } & T) {
    return input.id;
  }
}
