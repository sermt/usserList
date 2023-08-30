import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Filter, Order, UserResponse, UserError, Sort } from './types';
import { User } from '../models/user.model';
import { Observer } from 'rxjs';

const mockUsers: User[] = [
  { id: 1, name: 'Joan Doe', email: 'joanDoe@example.com', avatar: '' },
  { id: 2, name: 'Will Smith', email: 'willSmith@example.com', avatar: '' },
  { id: 3, name: 'Ana Diaz', email: 'anaDiaz@example.com', avatar: '' },
];

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should get users without search term and params', () => {
    userService.getUsers().subscribe((response: UserResponse) => {
      expect(response.users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('../../assets/db.json');
    req.flush({ users: mockUsers });
  });

  it('should filter users by name', () => {
    userService.getUsers('Will Smith').subscribe((response: UserResponse) => {
      expect(response.users[0].name).toBe('Will Smith');
    });

    const req = httpMock.expectOne('../../assets/db.json');
    req.flush({ users: mockUsers });
  });

  it('should throw error when no users found', () => {
    const observer: Observer<UserResponse> = {
      next: (response: UserResponse) =>
        fail('should have failed with the not found error'),
      error: (error: Error) => {
        expect(error).toEqual(new Error(UserError.NotFound));
      },
      complete: () => {

      },
    };

    userService.getUsers('Unknown').subscribe(observer);

    const req = httpMock.expectOne('../../assets/db.json');
    req.flush({ users: mockUsers });
  });

  it('should filter and sort users', () => {
    const searchTerm = 'd';
    const params = {
      filter: Filter.Name,
      sortBy: Sort.Name,
      orderBy: Order.Ascending,
    };

    userService
      .getUsers(searchTerm, params)
      .subscribe((response: UserResponse) => {
        expect(response.users[0].name).toBe('Ana Diaz');
        expect(response.users[1].name).toBe('Joan Doe');
      });

    const req = httpMock.expectOne('../../assets/db.json');
    req.flush({ users: mockUsers });
  });
});
