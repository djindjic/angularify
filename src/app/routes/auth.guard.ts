import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '../endpoints/api.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.apiService.sessionId) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
