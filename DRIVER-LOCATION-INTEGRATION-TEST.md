# Trip Service with Driver Location Integration - Test Guide

## Flow Overview

The complete flow now includes driver location data:

### 1. User creates trip request with location:

```json
POST /api/trips
{
  "userId": "user123",
  "pickupLatitude": 10.7769,    // User's pickup location
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,  // User's destination
  "destinationLongitude": 106.7019
}
```

### 2. Trip Service Process:

1. **Creates trip** with user's pickup and destination coordinates
2. **Searches for drivers** near the pickup location (5km radius)
3. **Finds nearest driver** and assigns them to the trip
4. **Gets driver's current location** from driver service
5. **Updates trip** with driver's coordinates
6. **Updates driver status** to "BUSY"
7. **Returns complete trip data** including both user and driver locations

### 3. Complete Response:

```json
{
  "id": "trip123",
  "userId": "user123",
  "driverId": "driver456",
  "status": "DRIVER_ACCEPTED",

  // User locations (pickup and destination)
  "pickupLatitude": 10.7769,
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,
  "destinationLongitude": 106.7019,

  // Driver's current location
  "driverLatitude": 10.775,
  "driverLongitude": 106.694,

  // Driver details
  "driverInfo": {
    "name": "John Doe",
    "phone": "+84901234567",
    "vehicleType": "MOTOBIKE",
    "licensePlate": "29A-12345",
    "rating": 4.8
  }
}
```

## Database Schema Updates

The Trip model now stores complete location data:

```prisma
model Trip {
  id                   String     @id @default(cuid())
  userId               String     // User ID
  driverId             String?    // Assigned driver ID
  status               TripStatus // Trip status

  // User locations
  pickupLatitude       Float?     // Where user wants to be picked up
  pickupLongitude      Float?
  destinationLatitude  Float?     // Where user wants to go
  destinationLongitude Float?

  // Driver location (when assigned)
  driverLatitude       Float?     // Driver's current location
  driverLongitude      Float?

  createdAt            DateTime
  updatedAt            DateTime
}
```

## Use Cases

### For Frontend Applications:

1. **User Trip Creation**: Users manually input pickup and destination
2. **Driver Assignment**: Automatic assignment with driver location
3. **Map Display**: Show user pickup/destination + driver's current location
4. **Distance Calculation**: Calculate distance between user and driver
5. **Navigation**: Provide directions for both user and driver

### For Driver App:

- Driver sees user's pickup location
- Driver sees user's destination
- User sees driver's current location

### For User App:

- User sees assigned driver's location
- User can track driver approaching pickup point
- User knows pickup and destination coordinates

## Testing the Flow

To test this integration, you need:

1. **Driver Service running** with Redis for geospatial data
2. **At least one driver online** with location data in Redis
3. **User location data** (manually input for development)

### Sample Driver Setup:

```bash
# Add a driver to Redis geospatial index
GEOADD drivers 106.6940 10.7750 driver456
```

### Sample API Call:

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "pickupLatitude": 10.7769,
    "pickupLongitude": 106.6951,
    "destinationLatitude": 10.7829,
    "destinationLongitude": 106.7019
  }'
```

### Expected Response:

- Trip created with all location data
- Driver automatically assigned
- Driver's current location included
- Driver status updated to BUSY

## Error Handling

### No Drivers Available:

```json
{
  "id": "trip123",
  "userId": "user123",
  "driverId": null,
  "status": "FINDING_DRIVER",
  "pickupLatitude": 10.7769,
  "pickupLongitude": 106.6951,
  "destinationLatitude": 10.7829,
  "destinationLongitude": 106.7019,
  "driverLatitude": null,
  "driverLongitude": null
}
```

### Driver Service Error:

- Falls back to FINDING_DRIVER status
- Logs error for debugging
- Returns trip without driver assignment

## Integration Complete ✅

The trip service now successfully:

- ✅ Accepts user location data (pickup + destination)
- ✅ Searches for nearby drivers using geospatial queries
- ✅ Auto-assigns nearest driver
- ✅ Retrieves and stores driver's current location
- ✅ Returns complete trip data with all location information
- ✅ Manages driver status (online ↔ busy)

This provides a complete foundation for a ride-hailing application with proper location handling!
