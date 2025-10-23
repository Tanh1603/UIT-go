import clerkClient from '@clerk/clerk-sdk-node';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from '@uit-go/shared-proto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async create(user: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    balance: number;
  }) {
    const clerk = await clerkClient.users.createUser({
      emailAddress: [user.email],
      username: user.username,
      password: user.password,
    });

    const profile = await firstValueFrom(
      this.userService.createUserProfile({
        fullName: user.fullName,
        phone: user.phone,
        balance: user.balance,
        email: user.email,
        userId: clerk.id,
      })
    );

    return {
      userId: clerk.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: profile.phone,
      balance: profile.balance,
    };
  }

  async findOne(id: string) {
    const clerk = await clerkClient.users.getUser(id);
    const profile = await firstValueFrom(this.userService.getUser({ id }));
    return {
      userId: clerk.id,
      username: clerk.username,
      email: profile.email,
      fullName: profile.fullName,
      phone: profile.phone,
      balance: profile.balance,
    };
  }
}
