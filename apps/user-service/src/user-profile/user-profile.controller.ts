import { Controller } from '@nestjs/common';
import {
  CreateUserProfileRequest,
  UserId,
  UserProfileResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@uit-go/shared-proto';
import { Observable } from 'rxjs';
import { UserProfileService } from './user-profile.service';

@Controller('user-profiles')
@UserServiceControllerMethods()
export class UserProfileController implements UserServiceController {
  constructor(private readonly userProfileService: UserProfileService) {}

  createUserProfile(
    request: CreateUserProfileRequest
  ):
    | Promise<UserProfileResponse>
    | Observable<UserProfileResponse>
    | UserProfileResponse {
    return this.userProfileService.create(request);
  }

  getUser(
    request: UserId
  ):
    | Promise<UserProfileResponse>
    | Observable<UserProfileResponse>
    | UserProfileResponse {
    return this.userProfileService.findOne(request.id);
  }
}
