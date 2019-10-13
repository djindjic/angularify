import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Movie} from '../../endpoints/models/movie.model';

@Component({
  selector: 'app-movie-list',
  template: `
      <div class="item" *ngFor="let movie of movies">{{ movie.title }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  @Input()
  public movies: Movie[] = [];
}
