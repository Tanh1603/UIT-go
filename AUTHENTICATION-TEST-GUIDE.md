# Authentication & Trip Creation Testing Guide

## Problem: Unauthorized Error

You're getting an "Unauthorized" error because the API Gateway has a **global authentication guard** (`ClerkAuthGuard`) that requires valid authentication tokens for all endpoints.

## Authentication Flow

### 1. Global Authentication Setup

The API Gateway (`apps/api-gateway/src/main.ts`) has a global guard:

```typescript
app.useGlobalGuards(new ClerkAuthGuard(reflector));
```

This means **ALL endpoints require authentication** unless marked with `@Public()` decorator.

### 2. Required Authentication Headers

Every API request must include:

```bash
Authorization: Bearer <clerk-jwt-token>
```

## How to Test Trip Creation Properly

### Option 1: Get a Real Clerk Token (Recommended)

1. **Register/Login via Auth Endpoints**:

```bash
# Register a user first
curl -X POST http://localhost:3000/api/v1/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+84901234567",
    "balance": 50000
  }'
```

2. **Get JWT Token from Clerk**:

   - Use Clerk's authentication endpoints
   - Get the JWT token from the response
   - Save it for API calls

3. **Create Trip with Authentication**:

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-clerk-jwt-token>" \
  -d '{
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

### Option 2: Temporarily Make Trip Creation Public (For Development)

**⚠️ Only for development/testing - remove before production!**

Update `apps/api-gateway/src/micro-service/trip/trip.controller.ts`:

```typescript
import { Public } from '../../common/decorator/public.decorator';

@Controller('trips')
export class TripController {
  // ... other methods

  @Post()
  @Public() // Add this line for testing only
  createTrip(@Body() data: CreateTripRequest, @CurrentUser() user: Record<string, unknown>) {
    // For testing without auth, use a mock userId
    const userId = user ? ((user?.id || user?.sub) as string) : 'test-user-123';
    return this.tripService.createTrip({ ...data, userId });
  }
}
```

Then test without authentication:

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

### Option 3: Use a Mock JWT Token (Advanced)

Create a valid JWT token with the required Clerk claims for testing.

## Updated Trip Creation Flow

With authentication, the complete flow now is:

1. **User Authentication**: User must be logged in with valid Clerk token
2. **Request with JWT**: Include `Authorization: Bearer <token>` header
3. **User Extraction**: Controller extracts `userId` from authenticated user
4. **Trip Creation**: Trip is created with the authenticated user's ID
5. **Driver Assignment**: System finds and assigns nearest driver
6. **Response**: Returns complete trip data with driver location

## Testing Checklist

### Prerequisites:

- ✅ API Gateway running (`npm run serve api-gateway`)
- ✅ Trip Service running (`npm run serve trip-service`)
- ✅ Driver Service running (`npm run serve driver-service`)
- ✅ Redis running (for driver locations)
- ✅ Valid Clerk authentication token

### Test Steps:

1. **Register User**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123","fullName":"Test","phone":"+84901234567","balance":50000}'
```

2. **Add Driver to Redis** (ensure drivers available):

```bash
# Connect to Redis and add a test driver
redis-cli
GEOADD drivers 106.6940 10.7750 driver456
```

3. **Create Trip with Auth**:

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

## Expected Response

```json
{
  "id": "trip123",
  "userId": "authenticated-user-id",
  "driverId": "driver456",
  "status": "DRIVER_ACCEPTED",
  "pickupLatitude": 10.7769,
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,
  "destinationLongitude": 106.7019,
  "driverLatitude": 10.775,
  "driverLongitude": 106.694,
  "driverInfo": {
    "name": "John Doe",
    "phone": "+84901234567",
    "vehicleType": "MOTOBIKE",
    "licensePlate": "29A-12345",
    "rating": 4.8
  }
}
```

## Common Authentication Errors

### 1. "Missing or invalid Authorization header"

- **Cause**: No `Authorization` header in request
- **Solution**: Add `Authorization: Bearer <token>` header

### 2. "Invalid or expired token"

- **Cause**: JWT token is invalid, expired, or malformed
- **Solution**: Get a fresh token from Clerk authentication

### 3. Token verification fails

- **Cause**: Clerk secret key configuration issue
- **Solution**: Check `CLERK_SECRET_KEY` in environment variables

## Environment Variables Required

```env
CLERK_SECRET_KEY=your-clerk-secret-key
USER_GRPC_URL=localhost:50051
TRIP_GRPC_URL=localhost:50052
```

## Security Notes

- **Never commit real Clerk keys** to version control
- **Remove @Public() decorators** before production deployment
- **Use environment-specific Clerk configurations** for different environments
- **Implement proper user role checking** for driver-specific endpoints

The authentication system is working as designed - you just need to include the proper JWT token in your requests!
