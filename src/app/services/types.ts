import { User } from '../models/user.model';

export enum Filter {
  Name = 'name',
  Email = 'email',
}

export enum Sort {
  Name = 'name',
  Email = 'email',
}

export enum Order {
  Ascending = 'asc',
  Descending = 'desc',
}

export enum UserError {
  NotFound = 'No users found matching the search criteria.',
}

export interface UserResponse {
  users: User[];
}

export interface Params {
  filter?: Filter;
  sortBy?: Sort;
  orderBy?: Order;
}
