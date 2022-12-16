import { Injectable } from '@nestjs/common';
import { User } from '@devit-test-project/library';


@Injectable()
export class UsersService {
  //TODO: login: replace with DB
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
