import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const table = "Addresses";
  const tableName = `"${table}"`;
  
  console.log(`Verifying sequence for ${tableName}...`);
  
  const result = await prisma.$queryRawUnsafe(`
    SELECT 
      (SELECT MAX(id) FROM ${tableName}) as max_id,
      last_value as sequence_value
    FROM "Addresses_id_seq"; -- standard postgres sequence name format
  `);
  
  console.log("Result:", result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
