import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() searchChanged = new EventEmitter<string>();
  searchFormControl = new FormControl('', Validators.required);

  performSearch(): void {
    const searchTerm = this.searchFormControl.value?.trim();
    if (searchTerm) {
      this.searchChanged.emit(searchTerm);
    }
  }
}
