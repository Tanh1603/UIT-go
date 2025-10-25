import { CreateDriverRequest, DriverProfileResponse, GetDriverRequest } from '@uit-go/shared-types';
import { Observable } from 'rxjs';

export interface DriverServiceClient {
  createDriver(data: CreateDriverRequest): Observable<DriverProfileResponse>;
  getDriver(data: GetDriverRequest): Observable<DriverProfileResponse>;
}
