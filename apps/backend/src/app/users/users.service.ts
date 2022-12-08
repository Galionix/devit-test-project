import { Injectable } from '@nestjs/common';

export type UserBasicInfo = {
  id: string;
  name: string;
};
export type UserExtendedInfo = {
  username: string;
  password: string;
};
export type User = UserBasicInfo & UserExtendedInfo;

@Injectable()
export class UsersService {
  //TODO: replace with DB
  private readonly users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      username: 'john',
      password: 'changeme',
    },
    {
      id: '2',
      name: 'Jane Doe',
      username: 'jane',
      password: 'guess',
    },
  ];
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
