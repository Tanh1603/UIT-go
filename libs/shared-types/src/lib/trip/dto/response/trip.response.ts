export interface TripResponse {
  id: string;
  userId: string;
  driverId?: string | undefined;
  status: string;
}
