import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.createMany({
        data: [
            {
                name: "PIPERA",
                tasks: {
                    createMany: {
                        data: [
                            {
                                name: "Task 1",
                                description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce pharetra lorem ex, blandit bibendum nisi lobortis sed. Donec at purus quis dui faucibus rhoncus sit amet et ipsum. Pellentesque lorem augue, volutpat tempor tortor quis, lacinia accumsan urna. Fusce tincidunt nec nisi sit amet tristique. Etiam sollicitudin efficitur ligula et dictum. Nulla ultrices convallis nulla, sed varius lorem venenatis a. Donec feugiat neque quis dolor bibendum, id vestibulum urna placerat. Quisque eget bibendum magna, et pellentesque risus. Etiam non risus et ipsum porttitor facilisis ac eget felis. Suspendisse pulvinar libero sed dolor aliquet interdum. Aenean cursus dolor magna, a tincidunt augue accumsan eu. Sed rutrum sollicitudin dui. Etiam pellentesque libero ut eleifend bibendum. Suspendisse tristique sapien scelerisque blandit gravida."
                            },
                            {
                                name: "Task 2",
                                description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce pharetra lorem ex, blandit bibendum nisi lobortis sed. Donec at purus quis dui faucibus rhoncus sit amet et ipsum. Pellentesque lorem augue, volutpat tempor tortor quis, lacinia accumsan urna. Fusce tincidunt nec nisi sit amet tristique. Etiam sollicitudin efficitur ligula et dictum. Nulla ultrices convallis nulla, sed varius lorem venenatis a. Donec feugiat neque quis dolor bibendum, id vestibulum urna placerat. Quisque eget bibendum magna, et pellentesque risus. Etiam non risus et ipsum porttitor facilisis ac eget felis. Suspendisse pulvinar libero sed dolor aliquet interdum. Aenean cursus dolor magna, a tincidunt augue accumsan eu. Sed rutrum sollicitudin dui. Etiam pellentesque libero ut eleifend bibendum. Suspendisse tristique sapien scelerisque blandit gravida."
                            },
                            {
                                name: "Task 3",
                                description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce pharetra lorem ex, blandit bibendum nisi lobortis sed. Donec at purus quis dui faucibus rhoncus sit amet et ipsum. Pellentesque lorem augue, volutpat tempor tortor quis, lacinia accumsan urna. Fusce tincidunt nec nisi sit amet tristique. Etiam sollicitudin efficitur ligula et dictum. Nulla ultrices convallis nulla, sed varius lorem venenatis a. Donec feugiat neque quis dolor bibendum, id vestibulum urna placerat. Quisque eget bibendum magna, et pellentesque risus. Etiam non risus et ipsum porttitor facilisis ac eget felis. Suspendisse pulvinar libero sed dolor aliquet interdum. Aenean cursus dolor magna, a tincidunt augue accumsan eu. Sed rutrum sollicitudin dui. Etiam pellentesque libero ut eleifend bibendum. Suspendisse tristique sapien scelerisque blandit gravida."
                            }
                        ]
                    }
                }
            },
            {
                name: "CLUJ"
            },
            {
                name: "IASI",
                status: 'COMMING_SOON'
            },
            {
                name: "DUBAI",
                status: 'COMMING_SOON'
            },
            {
                name: "PARIS",
                status: 'COMMING_SOON'
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