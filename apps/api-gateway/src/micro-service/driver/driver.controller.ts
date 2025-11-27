import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { DriverStatusEnum, NearbyQuery } from '@uit-go/shared-types';
import { DriverService } from './driver.service';

@Controller({
  version: '1',
  path: 'drivers',
})
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('/search')
  async search(@Query() query: NearbyQuery) {
    return (await this.driverService.searchNearBy(query)).list;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Patch('/:id/status')
  async updateStatus(
    @Body() { status }: { status: DriverStatusEnum },
    @Param('id') id: string
  ) {
    return this.driverService.updateStatus({ status, driverId: id });
  }

  @Patch(':id/location')
  async updateLocation(
    @Body() { latitude, longitude }: { latitude: number; longitude: number },
    @Param('id') id: string
  ) {
    return this.driverService.updateLocation({
      driverId: id,
      latitude: latitude,
      longitude: longitude,
    });
  }
}
