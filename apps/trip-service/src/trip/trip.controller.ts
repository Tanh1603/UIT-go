import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TripService } from './trip.service';
import {
  CreateTripRequest,
  TripId,
  AcceptTripRequest,
} from '@uit-go/shared-types';
import { GRPC_SERVICE } from '@uit-go/shared-client';

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, GRPC_SERVICE.TRIP.METHODS.CREATE)
  async createTrip(data: CreateTripRequest) {
    const trip = await this.tripService.createTrip(data);
    this.tripService.findNearestDriver(trip.id);
    return trip;
  }

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, GRPC_SERVICE.TRIP.METHODS.DETAIL)
  getTripById(data: TripId) {
    return this.tripService.getTripById(data.id);
  }

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, GRPC_SERVICE.TRIP.METHODS.CANCEL)
  cancelTrip(data: TripId) {
    return this.tripService.cancelTrip(data.id);
  }

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, 'AcceptTrip')
  acceptTrip(data: AcceptTripRequest) {
    return this.tripService.acceptTrip(data.id, data.driverId);
  }

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, 'StartTrip')
  startTrip(data: TripId) {
    return this.tripService.startTrip(data.id);
  }

  @GrpcMethod(GRPC_SERVICE.TRIP.NAME, 'CompleteTrip')
  completeTrip(data: TripId) {
    return this.tripService.completeTrip(data.id);
  }
}
