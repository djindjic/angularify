import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Movie} from './models/movie.model';
import {ApiService} from './api.service';
import {PaginatedResult} from './models/paginated-result.model';
import {expand, map} from 'rxjs/operators';

@Injectable()
export class MovieService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
  ) {}

  public search(query: string, page = 1): Observable<PaginatedResult<Movie>> {
    return this.http.get<PaginatedResult<Movie>>(`${this.apiService.apiUrl}/search/movie`, {
      params: {
        query,
        api_key: this.apiService.accessKey,
        page: page.toString()
      }
    });
  }

  public markAsFavorite(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiService.apiUrl}/account/optional/favorite?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: true
      },
    );
  }

  public unmarkAsFavorite(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiService.apiUrl}/account/optional/favorite?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: false
      },
    );
  }

  public getFavorites(): Observable<Movie[]> | any {
    return this.http.get<PaginatedResult<Movie>>(
      `https://api.themoviedb.org/3/account/optional/favorite/movies?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`
    ).pipe(
      expand(({ page, total_pages }) => {
        if (total_pages > page) {
          return this.http.get<PaginatedResult<Movie>>(`https://api.themoviedb.org/3/account/optional/favorite/movies?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}&page=${page + 1}`);
        } else {
          return EMPTY;
        }
      }),
      map(result => result.results),
    );
  }

  public addToWatchLater(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiService.apiUrl}/account/optional/watchlist?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: true
      },
    );
  }

  public removeFromWatchLater(id: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiService.apiUrl}/account/optional/watchlist?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: false
      },
    );
  }

  public getWatchLater(): Observable<Movie[]> | any {
    return this.http.get<PaginatedResult<Movie>>(
      `https://api.themoviedb.org/3/account/optional/watchlist/movies?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}`
    ).pipe(
      expand(({ page, total_pages }) => {
        if (total_pages > page) {
          return this.http.get<PaginatedResult<Movie>>(`https://api.themoviedb.org/3/account/optional/watchlist/movies?api_key=${this.apiService.accessKey}&session_id=${this.apiService.sessionId}&page=${page + 1}`);
        } else {
          return EMPTY;
        }
      }),
      map(result => result.results),
    );
  }
}
