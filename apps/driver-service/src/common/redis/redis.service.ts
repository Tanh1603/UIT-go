/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.client.connect();
  }

  async geoadd(key: string, lon: number, lat: number, member: string) {
    return this.client.geoAdd(key, [{ longitude: lon, latitude: lat, member }]);
  }

  async geopos(key: string, member: string) {
    return this.client.geoPos(key, member);
  }

  async geosearch(
    key: string,
    lon: number,
    lat: number,
    radiusKm: number,
    count?: number
  ) {
    // Add validation to ensure all required parameters are defined
    if (!key) {
      throw new Error('Redis key is required for geosearch');
    }
    if (lon === undefined || lon === null || isNaN(lon)) {
      throw new Error('Valid longitude is required for geosearch');
    }
    if (lat === undefined || lat === null || isNaN(lat)) {
      throw new Error('Valid latitude is required for geosearch');
    }
    if (
      radiusKm === undefined ||
      radiusKm === null ||
      isNaN(radiusKm) ||
      radiusKm <= 0
    ) {
      throw new Error('Valid radiusKm is required for geosearch');
    }

    const options: any = { SORT: 'ASC' };
    // Handle count more defensively - gRPC might pass 0 instead of undefined
    if (count !== undefined && count !== null && count > 0) {
      options.COUNT = count;
    }

    const results = await this.client.geoSearchWith(
      key,
      { longitude: lon, latitude: lat },
      { radius: radiusKm, unit: 'km' },
      ['WITHDIST'],
      options
    );
    return results.map((r) => ({
      member: r.member,
      distance: parseFloat(r.distance),
    }));
  }
}
