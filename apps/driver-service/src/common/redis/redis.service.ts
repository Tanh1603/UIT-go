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
    const options: any = { SORT: 'ASC' };
    if (count && count > 0) {
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
