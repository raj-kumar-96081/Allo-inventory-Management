import { PrismaClient } from '../src/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

if (!accelerateUrl) {
  throw new Error('Missing PRISMA_ACCELERATE_URL');
}

const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],
  accelerateUrl,
}).$extends(withAccelerate());

// const prisma = new PrismaClient();

async function main() {

  const warehouse1 =
    await prisma.warehouse.create({
      data: {
        code: 'BLR-1',
        name: 'Bangalore Warehouse',
        city: 'Bangalore',
      },
    });

  const warehouse2 =
    await prisma.warehouse.create({
      data: {
        code: 'DEL-1',
        name: 'Delhi Warehouse',
        city: 'Delhi',
      },
    });

  const product =
    await prisma.product.create({
      data: {
        sku: 'IPHONE-15',
        name: 'iPhone 15',
        description: 'Apple iPhone 15',
      },
    });

  await prisma.inventory.createMany({
    data: [
      {
        productId: product.id,
        warehouseId: warehouse1.id,
        availableQty: 50,
      },
      {
        productId: product.id,
        warehouseId: warehouse2.id,
        availableQty: 30,
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });