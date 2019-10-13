import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './routes/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import {ApiService} from './endpoints/api.service';
import {CallbackComponent} from './routes/callback/callback.component';
import {MovieService} from './endpoints/movie.service';
import {PagingComponent} from './components/paging/paging.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FavoritesStore} from './store/favorites.store';
import {AuthGuard} from './routes/auth.guard';
import {SearchStore} from './store/search.store';
import {MovieListComponent} from './components/movie-list/movie-list.component';
import {WatchLaterStore} from './store/watch-later.store';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CallbackComponent,
    PagingComponent,
    MovieListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApiService,
    MovieService,
    AuthGuard,
    FavoritesStore,
    SearchStore,
    WatchLaterStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
