import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.createMany({
        data: [
            {
                name: "PIPERA"
            },
            {
                name: "CLUJ"
            },
            {
                name: "IASI"
            },
            {
                name: "DUBAI"
            },
            {
                name: "PARIS"
            }
        ]
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