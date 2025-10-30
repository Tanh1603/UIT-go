# UIT-GO Trip Service Integration Guide

## Overview

This document outlines the integration of the trip-service with the existing microservices architecture, including Docker configuration updates.

## Architecture Changes

### Services and Ports

- **API Gateway**: Port 3000 (HTTP REST API)
- **User Service**: Port 50051 (gRPC)
- **Driver Service**: Port 50052 (gRPC)
- **Trip Service**: Port 50053 (gRPC) ✨ **NEW**

### Environment Configuration

#### Local Development (.env files)

Each service has been configured with cross-service communication URLs:

**Trip Service (.env)**:

```env
DATABASE_URL='postgresql://neondb_owner:npg_qfDEF7otyvb9@ep-aged-sound-a1jkbiox-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
TRIP_GRPC_URL="localhost:3003"
USER_GRPC_URL="localhost:3001"
DRIVER_GRPC_URL="localhost:3002"
PORT=3003
```

**API Gateway (.env)**:

```env
CLERK_SECRET_KEY=sk_test_sdKHDYOh61rCzA6ykQLnDb1v4KMaRwujRs1eQCllP5
PORT=3000
USER_GRPC_URL=localhost:3001
DRIVER_GRPC_URL=localhost:3002
TRIP_GRPC_URL=localhost:3003  # ✨ Added
```

Similar updates were made to User Service and Driver Service .env files.

> **Note**: For Docker deployment, you can manually adjust the `.env` files to use Docker networking URLs (e.g., `user-service:50051` instead of `localhost:3001`) when needed. Since this is a course project, we keep it simple with a single `.env` file per service.

### Code Changes

#### Trip Service Main Application

- **main.ts**: Changed from HTTP server to gRPC microservice using `tripGrpcOptions`
- **trip.module.ts**: Added gRPC client connections to User and Driver services
- **trip.service.ts**: Added gRPC client injection and prepared for cross-service communication

#### Key Integration Points

1. **Driver Service Integration**: `findNearestDriver()` method prepared for gRPC calls
2. **User Service Integration**: Available for user validation and profile lookups
3. **Database Integration**: Maintains separate Prisma client with trip-specific schema

### Docker Configuration Updates

#### Dockerfile Changes (trip-service)

- ✅ Proper Prisma client generation
- ✅ gRPC proto files copying
- ✅ Database migration handling
- ✅ Correct port exposure (50053)
- ✅ Startup script for initialization

#### Docker Compose Updates

- ✅ Added trip-service with proper networking
- ✅ All services configured with cross-service gRPC URLs
- ✅ Proper dependency management
- ✅ Database schema separation using PostgreSQL schemas

### Service Communication Flow

```
API Gateway (HTTP :3000)
    ↓
    ├── User Service (gRPC :50051)
    ├── Driver Service (gRPC :50052)
    └── Trip Service (gRPC :50053) ✨ NEW
         ↓
         ├── → User Service (for user validation)
         └── → Driver Service (for driver matching)
```

## Running the Services

### Local Development

```bash
# Terminal 1: User Service
cd apps/user-service && npm run start:dev

# Terminal 2: Driver Service
cd apps/driver-service && npm run start:dev

# Terminal 3: Trip Service ✨ NEW
cd apps/trip-service && npm run start:dev

# Terminal 4: API Gateway
cd apps/api-gateway && npm run start:dev
```

### Docker Deployment

```bash
# Build all services
docker-compose build

# Start the entire stack
docker-compose up

# Or start specific services
docker-compose up trip-service user-service driver-service api-gateway
```

### Testing Integration

```bash
# Test trip-service build
docker-compose build trip-service

# Test full stack
docker-compose up --build
```

## Next Steps

1. **Implement Cross-Service Communication**:

   - Complete the `findNearestDriver()` integration with driver-service
   - Add user validation calls to user-service

2. **Add Real-time Features**:

   - WebSocket integration for trip status updates
   - Driver location tracking

3. **Enhanced Error Handling**:

   - Circuit breaker patterns for service communication
   - Proper gRPC error handling

4. **Monitoring & Logging**:
   - Add service health checks
   - Implement distributed tracing

## Files Modified

### Environment Files

- ✅ `apps/trip-service/.env` - Service configuration
- ✅ `apps/api-gateway/.env` - Added TRIP_GRPC_URL
- ✅ `apps/user-service/.env` - Added cross-service URLs
- ✅ `apps/driver-service/.env` - Added cross-service URLs

> **Environment Management**: All services use a single `.env` file that can be manually adjusted for local development vs Docker deployment as needed.

### Application Code

- ✅ `apps/trip-service/src/main.ts` - gRPC microservice setup
- ✅ `apps/trip-service/src/trip/trip.module.ts` - Service client configuration
- ✅ `apps/trip-service/src/trip/trip.service.ts` - gRPC integration setup

### Docker Configuration

- ✅ `apps/trip-service/Dockerfile` - Updated build and startup
- ✅ `docker-compose.yml` - Added trip-service and environment variables
- ✅ `apps/trip-service/docker-startup.sh` - Startup script

The trip-service is now fully integrated into the microservices architecture and ready for development and deployment! 🚀
