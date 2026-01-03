import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing database sequences...");

  // List of tables with Int/BigInt @id @default(autoincrement())
  // Model name in Schema -> Table name in DB
  // Based on schema.prisma, most models don't have @@map, so they match model name.
  // Exception: User @@map("user"), Session @@map("session")... but those use String IDs (UUID/Cuid) mostly.
  // Checking models with Int autoincrement:
  const tables = [
    "Addresses",
    "Categories",
    "Suppliers",
    "ProductImages",
    "Inventory",
    "CartItems",
    "WishlistItems",
    "OrderItems",
    "Shipment_Method",
    "ReturnItems",
    "CustomerSegment",
    "SegmentCoupons",
    "IdempotencyKeys",
    "AuditLogs"
  ];

  for (const table of tables) {
    try {
      // We need to use quotes for case-sensitive table names if they were created that way.
      // Prisma usually creates tables with exact casing of the model if no map is provided.
      // PostgreSQL is case-sensitive for quoted identifiers.
      const tableName = `"${table}"`;
      
      // Query to find max ID and set sequence
      // pg_get_serial_sequence might need the table name in a specific format. 
      // Often it's case sensitive if created with quotes.
      
      console.log(`Checking ${tableName}...`);
      
      // This raw query attempts to set the val to max(id) + 1
      await prisma.$executeRawUnsafe(`
        SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) + 1 FROM ${tableName}), 1), false);
      `);
      
      console.log(`  ✓ Sequence updated for ${tableName}`);
    } catch (error) {
      console.log(`  ⚠ Could not update sequence for ${table}. It might utilize UUIDs or table name differs. Error: ${(error as Error).message}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
