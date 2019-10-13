import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) {}

  public set sessionId(value: string) {
    localStorage.sessionId = value;
  }
  public get sessionId(): string {
    return localStorage.sessionId;
  }

  public get accessKey(): string {
    return '6c0a3189ced79edf37d4ec0b28df74fa';
  }

  public get apiUrl(): string {
    return 'https://api.themoviedb.org/3';
  }

  public get authenticateUrl(): string {
    return 'https://www.themoviedb.org';
  }

  public get redirectUrl(): string {
    return `http://${window.location.host}/callback`;
  }

  public auth(requestToken: string): Observable<void> {
    return this.http
      .post(
        `${this.apiUrl}/authentication/session/new?api_key=${this.accessKey}`,
        {
          request_token: requestToken
        }
      )
      .pipe(
        tap((a: any) => this.sessionId = a.session_id),
      );
  }
}
