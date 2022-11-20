import { DiscordType, PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  let admin_snowflake = "";
  let botdev_snowflake = "";
  if (process.env.NODE_ENV === "production") {
    admin_snowflake = "550075400286371894";
    botdev_snowflake = "694292933293244476";
  } else {
    admin_snowflake = "1024706941446013010";
    botdev_snowflake = "1043835717933080666";
  }
  const admin = await prisma.discordRole.create({
    data: {
      name: "Admin",
      snowflake: admin_snowflake,
      type: DiscordType.ROLE,
    },
  });
  const botdev = await prisma.discordRole.create({
    data: {
      name: "Bot Dev",
      snowflake: botdev_snowflake,
      type: DiscordType.ROLE,
    },
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
