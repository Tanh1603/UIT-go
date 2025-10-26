/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '../../generated/prisma/index.js';
import pkg from 'redis';
const { createClient } = pkg;

const client = createClient({
  url: process.env.REDIS_URL,
});
client.connect();

async function geoadd(key: string, lon: number, lat: number, member: string) {
  return client.geoAdd(key, [{ longitude: lon, latitude: lat, member }]);
}
const prismaService = new PrismaClient();

const redisSeed = async () => {
  const driverIds = await prismaService.driverProfile.findMany({
    select: {
      userId: true,
      lastLat: true,
      lastLng: true,
    },
    where: {
      lastLat: { not: null },
      lastLng: { not: null },
    },
  });

  if (!driverIds.length) {
    console.log('⚠️ Không có tài xế nào có toạ độ hợp lệ.');
    return;
  }

  for (const driver of driverIds) {
    const key = 'drivers';
    const member = `${driver.userId}`;

    await geoadd(key, driver.lastLng ?? 0, driver.lastLat ?? 0, member);

    console.log(`✅ Seeded: ${member} (${driver.lastLat}, ${driver.lastLng})`);
  }
};

// main().catch((error) => console.log(error)).finally();

async function geosearch(
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

  const results = await client.geoSearchWith(
    key,
    { longitude: lon, latitude: lat },
    { radius: radiusKm, unit: 'km' },
    ['WITHDIST'],
    options
  );

  return results.map((r) => ({
    member: typeof r.member === 'string' ? r.member : r.member.toString(),
    distance: parseFloat(
      typeof r.distance === 'string' ? r.distance : r.distance.toString()
    ),
  }));
}

// HCM
const searchLat = 10.763;
const searchLng = 106.661;
const radiusKm = 2; // bán kính 2km

geosearch('drivers', searchLng, searchLat, radiusKm)
  .then((results) => {
    console.log('hello', results);
  })
  .catch(async (e) => {
    console.error('❌ Lỗi seed:', e);
    await prismaService.$disconnect();
    process.exit(1);
  });
// (10.762622, 106.660172), (10.764622, 106.662172), (10.765622, 106.664172), (21.028511, 105.804817), (16.054407, 108.202167)

// Đà Nẵng:
// const searchLat = 16.054;
// const searchLng = 108.202;
// const radiusKm = 2;

// Hà Nội
// const searchLat = 21.028;
// const searchLng = 105.804;
// const radiusKm = 3;

client.quit();
