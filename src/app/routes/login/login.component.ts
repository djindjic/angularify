import {ChangeDetectionStrategy, Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiService} from '../../endpoints/api.service';

@Component({
  selector: 'app-login',
  template: `
    <a class="button" href="{{ apiService.authenticateUrl }}/authenticate/{{ requestToken$ | async }}?redirect_to={{ apiService.redirectUrl}}">
        login
    </a>
  `,
  styles: [`
    :host {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: lightblue;
    }
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 115px;
        height: 25px;
        background: orange;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        color: black;
        font-weight: bold;
        text-decoration: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    public apiService: ApiService,
  ) {}

  public requestToken$ = this.http
    .get<{request_token: string}>(`${this.apiService.apiUrl}/authentication/token/new?api_key=${this.apiService.accessKey}`)
    .pipe(
      map(response => response.request_token)
    );
}
