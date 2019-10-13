import {Injectable} from '@angular/core';
import {Movie} from '../endpoints/models/movie.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {MovieService} from '../endpoints/movie.service';
import {map, tap} from 'rxjs/operators';

interface Favorites {
  movies: Movie[];
}

export enum FavoritesActionType {
  LOAD_FAVORITES,
  TOGGLE_FAVORITE
}

@Injectable()
export class FavoritesStore {

  constructor(
    private movieService: MovieService,
  ) {}

  public favorites$ = new BehaviorSubject<Favorites>({
    movies: [],
  });

  public isFavorite(movie: Movie): Observable<boolean> {
    return this.favorites$.pipe(
      map(({movies}) =>
        !!movies.find(m => m.id === movie.id),
      )
    );
  }

  public dispatch(action: FavoritesActionType, payload?: any): void {
    if (action === FavoritesActionType.LOAD_FAVORITES) {
      this.movieService.getFavorites()
        .pipe(
          tap((results: Movie[]) => {
            this.favorites$.next({
              movies: [
                ...this.favorites$.getValue().movies,
                ...results,
              ],
            });
          }),
        )
        .subscribe();
    }

    if (action === FavoritesActionType.TOGGLE_FAVORITE) {
      const alreadyFavorite = !!this.favorites$.getValue().movies.find(movie => movie.id === payload.id);

      if (alreadyFavorite) {
        this.favorites$.next({
          movies: this.favorites$.getValue().movies.filter( movie => movie.id !== payload.id )
        });

        this.movieService.unmarkAsFavorite(payload.id).subscribe();
      } else {
        this.favorites$.next({
          movies: [...this.favorites$.getValue().movies, payload],
        });

        this.movieService.markAsFavorite(payload.id).subscribe();
      }
    }
  }
}
