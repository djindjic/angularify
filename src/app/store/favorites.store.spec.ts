import {of} from 'rxjs';
import {FavoritesActionType, FavoritesStore} from './favorites.store';

describe('Favorites Store', () => {
  const mockedMovieService = {
    getFavorites() {
      return of([
          { id: 1, title: 'movie 1' },
          { id: 2, title: 'movie 2' },
        ]);
    },
    unmarkAsFavorite() {
      return of();
    },
    markAsFavorite() {
      return of();
    }
  } as any;

  it('should call getFavorites method on LOAD_FAVORITES', () => {
    const favoriteStore = new FavoritesStore(mockedMovieService);

    const getFavoritesSpy = spyOn(mockedMovieService, 'getFavorites').and.callThrough();

    favoriteStore.dispatch(FavoritesActionType.LOAD_FAVORITES);

    expect(getFavoritesSpy).toHaveBeenCalled();
  });

  it('should add new favorite on TOGGLE_FAVORITE', () => {
    const favoriteStore = new FavoritesStore(mockedMovieService);

    favoriteStore.dispatch(FavoritesActionType.LOAD_FAVORITES);
    favoriteStore.dispatch(FavoritesActionType.TOGGLE_FAVORITE, {id: 3, title: 'Transporter'});
    favoriteStore.dispatch(FavoritesActionType.TOGGLE_FAVORITE, {id: 4, title: 'Ocean'});

    expect(favoriteStore.favorites$.getValue().movies.length).toBe(4);
  });

  it('should remove existing favorite on TOGGLE_FAVORITE', () => {
    const favoriteStore = new FavoritesStore(mockedMovieService);

    favoriteStore.dispatch(FavoritesActionType.LOAD_FAVORITES);
    favoriteStore.dispatch(FavoritesActionType.TOGGLE_FAVORITE, { id: 1, title: 'movie 1' },);

    expect(favoriteStore.favorites$.getValue().movies.length).toBe(1);
  });

});
