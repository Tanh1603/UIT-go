import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../common/decorator/public.decorator';

@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(
    @Body()
    user: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      phone: string;
      balance: number;
    }
  ) {
    return this.userService.create(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
