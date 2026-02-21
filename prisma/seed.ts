import { PrismaClient } from "@prisma/client";
import { TOOLS } from "../src/config/tools";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed tool modules from config
  for (const tool of TOOLS) {
    await db.toolModule.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        description: tool.description,
        icon: tool.icon,
        color: tool.color,
        tag: tool.tag,
        status: tool.status,
        requiredTier: tool.requiredTier,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        icon: tool.icon,
        color: tool.color,
        tag: tool.tag,
        status: tool.status,
        requiredTier: tool.requiredTier,
      },
    });
    console.log(`  ✓ Tool seeded: ${tool.name}`);
  }

  // Seed admin user
  const hashedPassword = await bcrypt.hash("Admin@12345", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@cyberwraith.app" },
    update: {},
    create: {
      email: "admin@cyberwraith.app",
      name: "CyberWraith Admin",
      password: hashedPassword,
      role: "admin",
      subscription: {
        create: {
          tier: "agency",
          status: "active",
        },
      },
    },
  });

  console.log(`  ✓ Admin user seeded: ${admin.email}`);

  // Seed a test user
  const testPassword = await bcrypt.hash("Test@12345", 12);

  const testUser = await db.user.upsert({
    where: { email: "test@cyberwraith.app" },
    update: {},
    create: {
      email: "test@cyberwraith.app",
      name: "Test User",
      password: testPassword,
      role: "user",
      subscription: {
        create: {
          tier: "pro",
          status: "trialing",
        },
      },
    },
  });

  console.log(`  ✓ Test user seeded: ${testUser.email}`);
  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });