import { PrismaClient } from "@prisma/client";
import { gyms } from "./gyms";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.createMany({
        data: gyms
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