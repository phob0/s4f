import { PrismaClient } from "@prisma/client";
import gyms from "./gyms";
import tasks from "./tasks";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.create({
        data: {
            name: 'PIPERA',
            status: 'OPEN'
        }
    });
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect;
    })
    
    await Promise.all(
        Users.map(async (user) =>
          prisma.user.upsert({
            where : { id: user.id },
            update: {},
            create: user,
          })
        )
      );
    
      // Posts
      await Promise.all(
        Posts.map(async (post) =>
          prisma.post.upsert({
            where: { id: post.id },
            update: {},
            create: post,
          })
        )
      );