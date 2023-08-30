import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Filter } from 'src/app/services/types';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnDestroy {
  @Output() filterChanged = new EventEmitter<Filter>();
  private subscription: Subscription;

  filters = Object.keys(Filter);
  filterControl : FormControl = new FormControl();

  constructor() {
    this.subscription = this.filterControl.valueChanges.subscribe(
      (value) => {
        this.onFilterChanged(value);
      }
    );
  }

  onFilterChanged(filter: Filter): void {
    this.filterChanged.emit(filter);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
