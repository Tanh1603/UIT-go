import { Controller, Get, Param } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller({
  version: '1',
  path: 'drivers',
})
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }
}
