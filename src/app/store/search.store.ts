import {Injectable, OnDestroy} from '@angular/core';
import {Movie} from '../endpoints/models/movie.model';
import {BehaviorSubject, of, Subscription} from 'rxjs';
import {MovieService} from '../endpoints/movie.service';
import {share, switchMap, tap} from 'rxjs/operators';

interface ResultState {
  movies: Movie[];
  totalPages: number;
  loading: boolean;
}

interface QueryParamsState {
  query: string;
  page: number;
}

export enum SearchActionType {
  QUERY,
  CHANGE_PAGE,
}

@Injectable()
export class SearchStore implements OnDestroy {

  private queryParamsSubscription: Subscription;

  constructor(
    private movieService: MovieService,
  ) {
    this.queryParamsSubscription = this.queryParams$
      .pipe(
        tap(() =>
          this.resultState$.next({
            ...this.resultState$.getValue(),
            loading: true,
          })
        ),
        switchMap(({query, page}) => {
          if (query) {
            return this.movieService.search(query, page);
          } else {
            return of({page: 0, total_pages: 0, total_results: 0, results: []});
          }
        }),
        share(),
        tap(result =>
          this.resultState$.next({
            movies: result.results,
            totalPages: result.total_pages,
            loading: false,
          })
        ),
      ).subscribe();
  }

  public queryParams$ = new BehaviorSubject<QueryParamsState>({
    query: '',
    page: 1,
  });

  public resultState$ = new BehaviorSubject<ResultState>({
    movies: [],
    totalPages: 0,
    loading: false,
  });

  public dispatch(action: SearchActionType, payload: any): void {
    if (action === SearchActionType.QUERY) {
      this.queryParams$.next({
        page: 1,
        query: payload,
      });
    }

    if (action === SearchActionType.CHANGE_PAGE) {
      this.queryParams$.next({
        ...this.queryParams$.getValue(),
        page: payload,
      });
    }
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }
}
