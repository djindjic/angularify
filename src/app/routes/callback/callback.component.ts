import { Component, OnInit } from '@angular/core';
import {tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../endpoints/api.service';

@Component({
  selector: 'app-callback',
  template: ''
})
export class CallbackComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) { }

  public ngOnInit() {
    const requestToken = this.route.snapshot.queryParams.request_token;

    if (requestToken) {
      this.apiService
        .auth(this.route.snapshot.queryParams.request_token)
        .pipe(
          tap(() => this.router.navigate(['/']))
        )
        .subscribe();
    } else {
      this.router.navigate(['login']);
    }
  }
}
