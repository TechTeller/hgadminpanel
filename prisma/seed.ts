import { DiscordType, PrismaClient } from "@prisma/client";
import { env } from "../src/env/server.mjs";

const prisma = new PrismaClient();

async function main() {
  // default for development (currently using evlrobinson's personal test server role ids)
  let admin_snowflake = "1024706941446013010";
  let botdev_snowflake = "1043835717933080666";
  if (env.NODE_ENV === "production") {
    admin_snowflake = "550075400286371894";
    botdev_snowflake = "694292933293244476";
  }
  const admin = await prisma.discordRole.upsert({
    where: { id: "1" },
    create: {
      id: "1",
      name: "Admin",
      snowflake: admin_snowflake,
      type: DiscordType.ROLE,
    },
    update: {},
  });
  const botdev = await prisma.discordRole.upsert({
    where: { id: "2" },
    create: {
      id: "2",
      name: "Bot Dev",
      snowflake: botdev_snowflake,
      type: DiscordType.ROLE,
    },
    update: {},
  });
  console.log({ admin, botdev });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
