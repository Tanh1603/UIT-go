export const GRPC_SERVICE = {
  USER: {
    PACKAGE: 'user',
    NAME: 'UserService',
    METHODS: {
      CREATE: 'CreateUserProfile',
      DETAIL: 'GetUser',
    },
  },
  DRIVER: {
    PACKAGE: 'driver',
    NAME: 'DriverService',
    METHODS: {
      CREATE: 'CreateDriver',
      DETAIL: 'GetDriver',
      UPDATE_STATUS: 'UpdateStatus',
      UPDATE_LOCATION: 'UpdateLocation',
      SEARCH_NEARBY: 'SearchNearbyDrivers',
    },
  },
  TRIP: 'TripService',
} as const;

