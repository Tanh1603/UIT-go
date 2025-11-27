import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
