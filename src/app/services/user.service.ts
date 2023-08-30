import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Filter, Params, Order, Sort, UserError, UserResponse } from './types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private loading: boolean = false;

  getUsers(searchTerm: string = '', params?: Params): Observable<UserResponse> {
    this.loading=true;
    return this.http
      .get<UserResponse>('../../assets/db.json')
      .pipe(
        delay(1000),
        map((response) => this.processResponse(response, searchTerm, params))
      );
  }

  private processResponse(
    response: UserResponse,
    searchTerm: string,
    params?: Params
  ): UserResponse {
    this.loading = false;
    if (!searchTerm) {
      return response;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const { filter, sortBy, orderBy } = params ?? {};

    const filteredUsers = response.users.filter((user) =>
      this.filterUser(user, lowerCaseSearch, filter)
    );

    if (filteredUsers.length === 0) {
      throw new Error(UserError.NotFound);
    }

    if (sortBy && orderBy) {
      filteredUsers.sort(this.getComparator(sortBy, orderBy));
    }
    return {
      users: filteredUsers,
    };
  }

  private filterUser(user: User, searchTerm: string, filter?: Filter): boolean {
    // User did not select a filter.
    if (!filter) {
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    const userValue = filter.toLocaleLowerCase() === Filter.Name ? user.name : user.email;
    return userValue.toLowerCase().includes(searchTerm);
  }

  private getComparator(
    sortBy: Sort,
    orderBy: Order
  ): (a: User, b: User) => number {
    return (a: User, b: User) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (orderBy === Order.Ascending) {
        return aValue.localeCompare(bValue);
      } else if (orderBy === Order.Descending) {
        return bValue.localeCompare(aValue);
      }

      return 0;
    };
  }

  isLoading(): boolean {
    return this.loading;
  }
}
