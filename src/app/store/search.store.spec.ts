import {SearchActionType, SearchStore} from './search.store';
import {of} from 'rxjs';

describe('Search Store', () => {
  const mockedMovieService = {
    search() {
      return of({
        results: [
          { title: 'movie 1'},
          { title: 'movie 2'},
        ]
      });
    }
  } as any;

  it('should call search method with with initial query and first page', () => {
    const searchStore = new SearchStore(mockedMovieService);

    const searchSpy = spyOn(mockedMovieService, 'search').and.callThrough();

    searchStore.dispatch(SearchActionType.QUERY, 'movie');

    expect(searchSpy).toHaveBeenCalledWith('movie', 1);
  });

  it('should call search method with second page on CHANGE_PAGE', () => {
    const searchStore = new SearchStore(mockedMovieService);

    const searchSpy = spyOn(mockedMovieService, 'search').and.callThrough();

    searchStore.dispatch(SearchActionType.QUERY, 'movie');

    expect(searchSpy).toHaveBeenCalledWith('movie', 1);

    searchStore.dispatch(SearchActionType.CHANGE_PAGE, 2);

    expect(searchSpy).toHaveBeenCalledWith('movie', 2);
  });

  it('should save last query parameters in state', () => {
    const searchStore = new SearchStore(mockedMovieService);

    searchStore.dispatch(SearchActionType.QUERY, 'movie');
    searchStore.dispatch(SearchActionType.CHANGE_PAGE, 2);
    searchStore.dispatch(SearchActionType.QUERY, 'eleven');
    searchStore.dispatch(SearchActionType.CHANGE_PAGE, 3);

    expect(searchStore.queryParams$.getValue().query).toBe('eleven');
    expect(searchStore.queryParams$.getValue().page).toBe(3);
  });

  it('should reset page query parameter on new search', () => {
    const searchStore = new SearchStore(mockedMovieService);

    searchStore.dispatch(SearchActionType.QUERY, 'movie');
    searchStore.dispatch(SearchActionType.CHANGE_PAGE, 2);
    searchStore.dispatch(SearchActionType.QUERY, 'eleven');

    expect(searchStore.queryParams$.getValue().query).toBe('eleven');
    expect(searchStore.queryParams$.getValue().page).toBe(1);
  });
});
