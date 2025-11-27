import {
  CreateDriverRequest,
  DriverProfileResponse,
  GetDriverRequest,
  UpdateStatusRequest,
  UpdateLocationRequest,
  NearbyQuery,
  NearbyDriverResponse,
} from '@uit-go/shared-types';
import { Observable } from 'rxjs';

export interface DriverServiceClient {
  createDriver(data: CreateDriverRequest): Observable<DriverProfileResponse>;
  getDriver(data: GetDriverRequest): Observable<DriverProfileResponse>;
  updateStatus(data: UpdateStatusRequest): Observable<DriverProfileResponse>;
  updateLocation(
    data: UpdateLocationRequest
  ): Observable<DriverProfileResponse>;
  searchNearbyDrivers(data: NearbyQuery): Observable<NearbyDriverResponse>;
}
