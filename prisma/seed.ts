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

  // const warehouse1 =
  //   await prisma.warehouse.create({
  //     data: {
  //       code: 'BLR-1',
  //       name: 'Bangalore Warehouse',
  //       city: 'Bangalore',
  //     },
  //   });

  // const warehouse2 =
  //   await prisma.warehouse.create({
  //     data: {
  //       code: 'DEL-1',
  //       name: 'Delhi Warehouse',
  //       city: 'Delhi',
  //     },
  //   });

  // const product =
  //   await prisma.product.create({
  //     data: {
  //       sku: 'IPHONE-15',
  //       name: 'iPhone 15',
  //       description: 'Apple iPhone 15',
  //     },
  //   });

  // await prisma.inventory.createMany({
  //   data: [
  //     {
  //       productId: product.id,
  //       warehouseId: warehouse1.id,
  //       availableQty: 50,
  //     },
  //     {
  //       productId: product.id,
  //       warehouseId: warehouse2.id,
  //       availableQty: 30,
  //     },
  //   ],
  // });

  const warehouse1 =
    await prisma.warehouse.create({
      data: {
        code: 'MUM-1',
        name: 'Mumbai Central Warehouse',
        city: 'Mumbai',
      },
    });

  const warehouse2 =
    await prisma.warehouse.create({
      data: {
        code: 'HYD-1',
        name: 'Hyderabad Warehouse',
        city: 'Hyderabad',
      },
    });

  const warehouse3 =
    await prisma.warehouse.create({
      data: {
        code: 'CHN-1',
        name: 'Chennai Warehouse',
        city: 'Chennai',
      },
    });

  const samsungProduct =
    await prisma.product.create({
      data: {
        sku: 'SAMSUNG-S24',
        name: 'Samsung Galaxy S24',
        description:
          'Samsung flagship smartphone',
      },
    });

  const macbookProduct =
    await prisma.product.create({
      data: {
        sku: 'MACBOOK-AIR-M3',
        name: 'MacBook Air M3',
        description:
          'Apple MacBook Air with M3 chip',
      },
    });

  const sonyProduct =
    await prisma.product.create({
      data: {
        sku: 'SONY-WH1000XM5',
        name: 'Sony WH-1000XM5',
        description:
          'Sony Noise Cancelling Headphones',
      },
    });

  await prisma.inventory.createMany({
    data: [

      // Samsung S24 Inventory

      {
        productId:
          samsungProduct.id,

        warehouseId:
          warehouse1.id,

        availableQty: 40,
      },

      {
        productId:
          samsungProduct.id,

        warehouseId:
          warehouse2.id,

        availableQty: 25,
      },

      {
        productId:
          samsungProduct.id,

        warehouseId:
          warehouse3.id,

        availableQty: 18,
      },

      // MacBook Air Inventory

      {
        productId:
          macbookProduct.id,

        warehouseId:
          warehouse1.id,

        availableQty: 12,
      },

      {
        productId:
          macbookProduct.id,

        warehouseId:
          warehouse2.id,

        availableQty: 8,
      },

      {
        productId:
          macbookProduct.id,

        warehouseId:
          warehouse3.id,

        availableQty: 6,
      },

      // Sony Headphones Inventory

      {
        productId:
          sonyProduct.id,

        warehouseId:
          warehouse1.id,

        availableQty: 35,
      },

      {
        productId:
          sonyProduct.id,

        warehouseId:
          warehouse2.id,

        availableQty: 20,
      },

      {
        productId:
          sonyProduct.id,

        warehouseId:
          warehouse3.id,

        availableQty: 15,
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