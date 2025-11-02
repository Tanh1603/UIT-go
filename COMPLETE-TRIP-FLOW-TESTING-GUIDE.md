# Complete Trip Flow Testing Guide

## Overview: Trip Lifecycle

The complete trip flow involves multiple services and follows this lifecycle:

```
1. User creates trip → 2. Driver assignment → 3. Driver accepts → 4. Trip starts → 5. Trip completes
```

## Prerequisites Setup

### 1. Start All Services

```powershell
# Terminal 1: API Gateway
npm run serve api-gateway

# Terminal 2: Trip Service
npm run serve trip-service

# Terminal 3: Driver Service
npm run serve driver-service

# Terminal 4: User Service
npm run serve user-service

# Terminal 5: Redis (for driver locations)
redis-server
```

### 2. Setup Test Data

#### A. Create Test Driver in Database

```powershell
# Connect to your driver service database and insert a test driver
# Or use the API to register a driver
curl -X POST http://localhost:3000/api/v1/auth/register/driver \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testdriver",
    "email": "driver@test.com",
    "password": "password123",
    "name": "John Driver",
    "phone": "+84901234567",
    "vehicleType": "MOTOBIKE",
    "licensePlate": "29A-12345",
    "licenseNumber": "DL123456"
  }'
```

#### B. Add Driver Location to Redis

```bash
# Connect to Redis and add driver geolocation
redis-cli
GEOADD drivers 106.6940 10.7750 driver-uuid-here
```

#### C. Set Driver Status to ONLINE

```powershell
# You'll need to call the driver service to set status to ONLINE
# This can be done via API or directly in database
```

## Complete Testing Flow

### Step 1: Create Trip Request

```powershell
# POST /api/trips - Create a new trip
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

**Expected Response:**

```json
{
  "id": "trip-uuid",
  "userId": "test-user-123",
  "driverId": "driver-uuid",
  "status": "DRIVER_ACCEPTED",
  "pickupLatitude": 10.7769,
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,
  "destinationLongitude": 106.7019,
  "driverLatitude": 10.775,
  "driverLongitude": 106.694,
  "driverInfo": {
    "name": "John Driver",
    "phone": "+84901234567",
    "vehicleType": "MOTOBIKE",
    "licensePlate": "29A-12345",
    "rating": 4.8
  }
}
```

**What Happens Behind the Scenes:**

1. API Gateway receives request
2. Forwards to Trip Service via gRPC
3. Trip Service creates trip in database
4. Trip Service calls Driver Service to find nearby drivers
5. Trip Service assigns nearest driver
6. Trip Service updates driver status to BUSY
7. Trip Service gets driver info and location
8. Response returned with complete trip data

### Step 2: Get Trip Details

```powershell
# GET /api/trips/:id - Get trip by ID
curl -X GET http://localhost:3000/api/trips/trip-uuid-here
```

**Expected Response:**

```json
{
  "id": "trip-uuid",
  "userId": "test-user-123",
  "driverId": "driver-uuid",
  "status": "DRIVER_ACCEPTED",
  "pickupLatitude": 10.7769,
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,
  "destinationLongitude": 106.7019,
  "driverLatitude": 10.775,
  "driverLongitude": 106.694,
  "driverInfo": {
    "name": "John Driver",
    "phone": "+84901234567",
    "vehicleType": "MOTOBIKE",
    "licensePlate": "29A-12345",
    "rating": 4.8
  }
}
```

### Step 3: Start Trip

```powershell
# POST /api/trips/:id/start - Driver starts the trip
curl -X POST http://localhost:3000/api/trips/trip-uuid-here/start
```

**Expected Response:**

```json
{
  "id": "trip-uuid",
  "status": "ONGOING",
  "userId": "test-user-123",
  "driverId": "driver-uuid"
  // ... other trip details
}
```

### Step 4: Complete Trip

```powershell
# POST /api/trips/:id/complete - Driver completes the trip
curl -X POST http://localhost:3000/api/trips/trip-uuid-here/complete
```

**Expected Response:**

```json
{
  "id": "trip-uuid",
  "status": "COMPLETED",
  "userId": "test-user-123",
  "driverId": "driver-uuid"
  // ... other trip details
}
```

**What Happens Behind the Scenes:**

1. Trip status updated to COMPLETED
2. Driver status automatically updated back to ONLINE
3. Driver becomes available for new trips

### Step 5: Cancel Trip (Alternative Flow)

```powershell
# POST /api/trips/:id/cancel - Cancel an active trip
curl -X POST http://localhost:3000/api/trips/trip-uuid-here/cancel
```

**Expected Response:**

```json
{
  "id": "trip-uuid",
  "status": "CANCELED",
  "userId": "test-user-123",
  "driverId": "driver-uuid"
  // ... other trip details
}
```

## Service Communication Flow

```
HTTP Request → API Gateway → gRPC → Trip Service → gRPC → Driver/User Services
     ↓              ↓            ↓          ↓              ↓
   Client    Authentication  Service Mesh  Business     Data Layer
                  Layer       Communication  Logic      (Database)
```

### What Each Service Does:

#### API Gateway:

- Handles HTTP requests
- Authentication (when enabled)
- Routes to appropriate microservices
- Converts HTTP to gRPC calls

#### Trip Service:

- Creates and manages trips
- Orchestrates driver assignment
- Calls Driver Service for location queries
- Calls User Service for user data
- Manages trip state transitions

#### Driver Service:

- Manages driver profiles
- Handles geospatial queries (Redis)
- Updates driver status and location
- Provides driver information

#### User Service:

- Manages user profiles
- Provides user information

## Testing Different Scenarios

### Scenario 1: No Drivers Available

```powershell
# Clear Redis drivers
redis-cli
FLUSHALL

# Create trip - should return FINDING_DRIVER status
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

### Scenario 2: Multiple Drivers Available

```bash
# Add multiple drivers to Redis
redis-cli
GEOADD drivers 106.6940 10.7750 driver1
GEOADD drivers 106.6945 10.7755 driver2
GEOADD drivers 106.6935 10.7745 driver3
```

### Scenario 3: Driver Too Far Away

```bash
# Add driver far from pickup location
redis-cli
GEOADD drivers 106.8000 10.9000 far-driver
```

## Monitoring and Debugging

### Check Service Logs

- Monitor terminal outputs for each service
- Look for gRPC communication logs
- Check error messages and stack traces

### Database Queries

```sql
-- Check trip status
SELECT * FROM Trip WHERE id = 'trip-uuid';

-- Check driver status
SELECT * FROM Driver WHERE id = 'driver-uuid';
```

### Redis Queries

```bash
# Check driver locations
redis-cli
GEORADIUS drivers 106.6951 10.7769 5 km WITHCOORD WITHDIST
```

## Common Issues and Solutions

### 1. "No drivers available"

- **Check**: Drivers exist in Redis with GEOADD
- **Check**: Drivers are within 5km radius
- **Check**: Driver status is ONLINE (not BUSY)

### 2. "Service connection refused"

- **Check**: All services are running on correct ports
- **Check**: gRPC configuration matches between services

### 3. "Database connection error"

- **Check**: Database is running and accessible
- **Check**: Prisma migrations are applied
- **Check**: Connection strings are correct

### 4. "Authentication errors"

- **Solution**: Disable auth for testing (as discussed earlier)
- **Alternative**: Use valid JWT tokens

## Success Indicators

✅ **Trip Creation**: Returns trip with assigned driver
✅ **Driver Assignment**: Driver status changes to BUSY
✅ **Trip Progression**: Status changes DRIVER_ACCEPTED → ONGOING → COMPLETED
✅ **Driver Release**: Driver status returns to ONLINE after completion
✅ **Data Consistency**: All services reflect correct trip state

## Performance Testing

### Load Testing

```powershell
# Create multiple trips simultaneously
for ($i=1; $i -le 10; $i++) {
  Start-Job {
    curl -X POST http://localhost:3000/api/trips -H "Content-Type: application/json" -d '{"userId":"user-$i","pickupLatitude":10.7769,"pickupLongitude":106.6951,"destinationLatitude":10.7829,"destinationLongitude":106.7019}'
  }
}
```

This comprehensive testing approach covers the entire trip lifecycle and helps you verify that all services are communicating correctly and handling the business logic as expected!
