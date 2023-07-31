import { PrismaClient } from "@prisma/client";
import { tasks } from "./tasks";

const prisma = new PrismaClient()
const taskList = tasks

async function main() {
    await prisma.gym.create({
        data: {
                name: "PIPERA",
                address: "erd1qqqqqqqqqqqqqpgq45xtljt6j2a0vrnck68zfcln5nx0m5t7u7zsnwj48x",
                status: 'OPEN',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "CLUJ",
                address: "",
                status: 'COMMING_SOON',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "IASI",
                address: "",
                status: 'COMMING_SOON',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "DUBAI",
                address: "",
                status: 'COMMING_SOON',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "PARIS",
                address: "",
                status: 'COMMING_SOON',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
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