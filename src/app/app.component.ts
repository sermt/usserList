import { Component } from '@angular/core';
import { Subscription, catchError, map } from 'rxjs'; // Importa switchMap
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { Filter, Order, Params, Sort, UserError } from './services/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private subscription: Subscription;
  private activeFilter: Filter | undefined;
  private orderBy: Order | undefined;
  private sortBy: Sort | undefined;

  users: User[] = [];
  searchError: string = '';

  constructor(private userService: UserService) {
    this.subscription = this.userService
      .getUsers()
      .pipe(
        map((response) => response.users),
        catchError((error) => {
          if (
            error.message === 'No users found matching the search criteria.'
          ) {
            this.searchError = error.message;
          }
          return [];
        })
      )
      .subscribe((users) => {
        this.users = users;
      });
  }

  onSearch(searchTerm: string): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const params: Params = {
      filter: this.activeFilter,
      sortBy: this.sortBy,
      orderBy: this.orderBy,
    };

    this.subscription = this.userService
      .getUsers(searchTerm, params)
      .pipe(
        map((response) => response.users),
        catchError((error) => {
          if (error.message === UserError.NotFound) {
            this.searchError = error.message;
            // Clear users
            this.users = [];
          }
          throw new Error(UserError.NotFound);
        })
      )
      .subscribe((users) => {
        this.users = users;
        this.searchError = '';
      });
  }

  onFilter(filter: Filter): void {
    this.activeFilter = filter;
  }
  onSorting(sorting: Partial<Params>): void {
    this.sortBy = sorting.sortBy;
    this.orderBy = sorting.orderBy;
  }

  isLoading(): boolean {
    return this.userService.isLoading();
  }
}
