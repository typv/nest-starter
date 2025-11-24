import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/data-access/base.repository';
import { User } from 'src/data-access/user/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {}
