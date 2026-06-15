import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

type AuthenticatedUser = Omit<User, 'password'>;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    user: AuthenticatedUser,
    done: (err: Error | null, id?: number) => void,
  ) {
    done(null, user.id);
  }

  async deserializeUser(
    id: number,
    done: (err: Error | null, user?: AuthenticatedUser | false) => void,
  ) {
    const user = await this.usersService.findById(id);

    if (!user) {
      return done(null, false);
    }

    const authenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return done(null, authenticatedUser);
  }
}
