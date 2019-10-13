import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-paging',
  template: `
    <button
        *ngFor="let page of pages"
        (click)="pageChanged.emit(page)">
        {{ page }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingComponent {
  @Input()
  public totalPages = 0;

  @Output()
  public pageChanged = new EventEmitter<number>();

  public get pages(): number[] {
    return Array(this.totalPages).fill(0).map((v, i) => i + 1);
  }
}
