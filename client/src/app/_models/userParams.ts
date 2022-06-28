import { User } from './user.interface';

export class UserParams {
  gender: string;
  minAge: number = 18;
  maxAge: number = 100;
  pageNumber: number = 1;
  pageSize: number = 8;
  orderBy = 'lastActive';

  constructor(user: User) {
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
