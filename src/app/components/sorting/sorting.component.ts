import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Order, Params, Sort } from 'src/app/services/types';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
})
export class SortingComponent implements OnDestroy {
  @Output() sortingChanged = new EventEmitter<Partial<Params>>();
  private subscription: Subscription;
  orderBy = Order;
  sortingKeys = Object.values(Sort);
  sortingByControl = new FormControl();
  sortOrder: Order = Order.Ascending;

  constructor() {
    this.subscription = this.sortingByControl.valueChanges.subscribe(
      (value: Sort) => this.emitSortingChange(value)
    );
  }

  toggleSortOrder(): void {
    this.sortOrder =
      this.sortOrder === Order.Ascending ? Order.Descending : Order.Ascending;
    this.emitSortingChange(this.sortingByControl.value);
  }

  private emitSortingChange(sortBy: Sort): void {
    this.sortingChanged.emit({ sortBy, orderBy: this.sortOrder });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
