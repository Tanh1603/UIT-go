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
    },
  },
  TRIP: 'TripService',
} as const;

