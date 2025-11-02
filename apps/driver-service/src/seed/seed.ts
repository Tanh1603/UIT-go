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

const createTestDrivers = async () => {
  // Test driver locations in Ho Chi Minh City
  const testDrivers = [
    {
      userId: 'driver-test-1',
      name: 'Test Driver 1',
      email: 'driver1@test.com',
      phone: '+84901234567',
      lat: 10.762622,
      lng: 106.660172,
    },
    {
      userId: 'driver-test-2',
      name: 'Test Driver 2',
      email: 'driver2@test.com',
      phone: '+84901234568',
      lat: 10.764622,
      lng: 106.662172,
    },
    {
      userId: 'driver-test-3',
      name: 'Test Driver 3',
      email: 'driver3@test.com',
      phone: '+84901234569',
      lat: 10.765622,
      lng: 106.664172,
    },
  ];

  console.log('🚗 Creating test drivers...');

  for (const driver of testDrivers) {
    try {
      // Create driver profile (contains all driver info in this schema)
      await prismaService.driverProfile.upsert({
        where: { userId: driver.userId },
        update: {
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          lastLat: driver.lat,
          lastLng: driver.lng,
          status: 'ONLINE',
        },
        create: {
          userId: driver.userId,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          lastLat: driver.lat,
          lastLng: driver.lng,
          status: 'ONLINE',
          vehicleType: 'MOTOBIKE',
          licensePlate: `TEST-${driver.userId.slice(-1)}`,
          licenseNumber: `LIC${driver.userId.slice(-1)}`,
        },
      });

      // Add to Redis
      await geoadd('drivers', driver.lng, driver.lat, driver.userId);

      console.log(
        `✅ Created driver: ${driver.name} at (${driver.lat}, ${driver.lng})`
      );
    } catch (error) {
      console.error(`❌ Error creating driver ${driver.userId}:`, error);
    }
  }
};

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

// Main execution
async function main() {
  try {
    console.log('🌱 Starting seed process...');

    // Create test drivers
    await createTestDrivers();

    // Test search
    console.log('\n🔍 Testing geosearch...');
    const results = await geosearch('drivers', searchLng, searchLat, radiusKm);
    console.log('Search results:', results);

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prismaService.$disconnect();
    await client.quit();
  }
}

main();
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
