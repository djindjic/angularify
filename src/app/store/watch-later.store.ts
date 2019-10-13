import {Injectable} from '@angular/core';
import {Movie} from '../endpoints/models/movie.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {MovieService} from '../endpoints/movie.service';
import {map, tap} from 'rxjs/operators';

interface WatchLater {
  movies: Movie[];
}

export enum WatchLaterType {
  LOAD_WATCH_LATER,
  TOGGLE_WATCH_LATER
}

@Injectable()
export class WatchLaterStore {

  constructor(
    private movieService: MovieService,
  ) {}

  public watchLater$ = new BehaviorSubject<WatchLater>({
    movies: [],
  });

  public isInWatchLater(movie: Movie): Observable<boolean> {
    return this.watchLater$.pipe(
      map(({movies}) =>
        !!movies.find(m => m.id === movie.id),
      )
    );
  }

  public dispatch(action: WatchLaterType, payload?: any): void {
    if (action === WatchLaterType.LOAD_WATCH_LATER) {
      this.movieService.getWatchLater()
        .pipe(
          tap((results: Movie[]) => {
            this.watchLater$.next({
              movies: [
                ...this.watchLater$.getValue().movies,
                ...results,
              ],
            });
          }),
        )
        .subscribe();
    }

    if (action === WatchLaterType.TOGGLE_WATCH_LATER) {
      const alreadyInWatchLater = !!this.watchLater$.getValue().movies.find(movie => movie.id === payload.id);

      if (alreadyInWatchLater) {
        this.watchLater$.next({
          movies: this.watchLater$.getValue().movies.filter( movie => movie.id !== payload.id )
        });

        this.movieService.removeFromWatchLater(payload.id).subscribe();
      } else {
        this.watchLater$.next({
          movies: [...this.watchLater$.getValue().movies, payload],
        });

        this.movieService.addToWatchLater(payload.id).subscribe();
      }
    }
  }
}
