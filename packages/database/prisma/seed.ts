import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'demo.example.com' },
    update: {},
    create: {
      name: 'Demo Restaurant Group',
      domain: 'demo.example.com',
    },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Main Branch',
      tenantId: tenant.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Signature Burger',
      price: 15.99,
      restaurantId: restaurant.id,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
