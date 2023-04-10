import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.create({
        data: {
            name: 'PIPERA',
            status: 'OPEN'
        }
    });
}