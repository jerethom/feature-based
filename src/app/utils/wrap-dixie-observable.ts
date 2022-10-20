import { liveQuery } from 'dexie';
import { Observable } from 'rxjs';

export function wrapDixieObservable<T>(obs: ReturnType<typeof liveQuery<T>>) {
  return new Observable<T>((observer) => {
    const query = obs.subscribe({
      next: (value) => observer.next(value),
      error: (error) => observer.error(error),
    });

    return () => query.unsubscribe();
  });
}
