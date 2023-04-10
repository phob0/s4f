import { PrismaClient } from "@prisma/client";
import { tasks } from "./tasks";

const prisma = new PrismaClient()
const taskList = tasks

async function main() {
    await prisma.gym.create({
        data: {
                name: "PIPERA",
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "PIPERA",
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
    await prisma.gym.create({
        data: {
                name: "PIPERA",
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
                status: 'COMMING_SOON',
                tasks: {
                    createMany: {
                        data: taskList
                    }
                }
            }
    });
}

            // {
            //     name: "CLUJ"
            // },
            // {
            //     name: "IASI",
            //     status: 'COMMING_SOON'
            // },
            // {
            //     name: "DUBAI",
            //     status: 'COMMING_SOON'
            // },
            // {
            //     name: "PARIS",
            //     status: 'COMMING_SOON'
            // }

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect;
    })