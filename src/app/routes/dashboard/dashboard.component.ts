import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {SearchActionType, SearchStore} from '../../store/search.store';
import {Subscription} from 'rxjs';
import {FavoritesActionType, FavoritesStore} from '../../store/favorites.store';
import {Movie} from '../../endpoints/models/movie.model';
import {WatchLaterStore, WatchLaterType} from '../../store/watch-later.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private searchQueryInputSubscription: Subscription;

  public searchQueryInput = new FormControl();
  public showFavorites = false;
  public showWatchLater = false;

  constructor(
    public watchLaterStore: WatchLaterStore,
    public favoritesStore: FavoritesStore,
    public searchStore: SearchStore,
  ) {}

  public ngOnInit(): void {
    this.favoritesStore.dispatch(FavoritesActionType.LOAD_FAVORITES);
    this.watchLaterStore.dispatch(WatchLaterType.LOAD_WATCH_LATER);

    this.searchQueryInputSubscription = this.searchQueryInput
      .valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(query => {
          this.searchStore.dispatch(SearchActionType.QUERY, query);
        })
      )
      .subscribe();
  }

  public onPageChanged(page: number): void {
    this.searchStore.dispatch(SearchActionType.CHANGE_PAGE, page);
  }

  public onToggleFavorite(movie: Movie) {
    this.favoritesStore.dispatch(FavoritesActionType.TOGGLE_FAVORITE, movie);
  }

  public onToggleWatchLater(movie: Movie) {
    this.watchLaterStore.dispatch(WatchLaterType.TOGGLE_WATCH_LATER, movie);
  }

  public ngOnDestroy(): void {
    this.searchQueryInputSubscription.unsubscribe();
  }
}
