import {of} from 'rxjs';
import {WatchLaterType, WatchLaterStore} from './watch-later.store';

describe('Watch Later Store', () => {
  const mockedMovieService = {
    getWatchLater() {
      return of([
        { id: 1, title: 'movie 1' },
        { id: 2, title: 'movie 2' },
      ]);
    },
    addToWatchLater() {
      return of();
    },
    removeFromWatchLater() {
      return of();
    }
  } as any;

  it('should call getWatchLaterSpy method on LOAD_WATCH_LATER', () => {
    const favoriteStore = new WatchLaterStore(mockedMovieService);

    const getWatchLaterSpy = spyOn(mockedMovieService, 'getWatchLater').and.callThrough();

    favoriteStore.dispatch(WatchLaterType.LOAD_WATCH_LATER);

    expect(getWatchLaterSpy).toHaveBeenCalled();
  });

  it('should add new movie to watch later list on TOGGLE_FAVORITE', () => {
    const watchLaterStore = new WatchLaterStore(mockedMovieService);

    watchLaterStore.dispatch(WatchLaterType.LOAD_WATCH_LATER);
    watchLaterStore.dispatch(WatchLaterType.TOGGLE_WATCH_LATER, {id: 3, title: 'Transporter'});
    watchLaterStore.dispatch(WatchLaterType.TOGGLE_WATCH_LATER, {id: 4, title: 'Ocean'});

    expect(watchLaterStore.watchLater$.getValue().movies.length).toBe(4);
  });

  it('should remove existing moview from watch later list on TOGGLE_FAVORITE', () => {
    const watchLaterStore = new WatchLaterStore(mockedMovieService);

    watchLaterStore.dispatch(WatchLaterType.LOAD_WATCH_LATER);
    watchLaterStore.dispatch(WatchLaterType.TOGGLE_WATCH_LATER, { id: 1, title: 'movie 1' },);

    expect(watchLaterStore.watchLater$.getValue().movies.length).toBe(1);
  });

});
