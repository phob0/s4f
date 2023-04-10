import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    await prisma.gym.create({
        data: 
            {
                name: "PIPERA",
                tasks: {
                    create: [
                        { name: 'asd' }
                    ]
                }
            },
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