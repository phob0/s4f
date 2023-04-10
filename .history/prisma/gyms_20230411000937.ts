import { PrismaClient } from "@prisma/client";
import { tasks } from "./tasks";

export const gyms = [
    {
        name: "PIPERA",
        status: "OPEN"
        tasks: prisma.gym.createMany({
                    data: tasks
                })
    },
    {
        name: "CLUJ",
        status: "OPEN"
    },
    {
        name: "IASI",
        status: "COMMING_SOON"
    },
    {
        name: "DUBAI",
        status: "COMMING_SOON"
    },
    {
        name: "PARIS",
        status: "COMMING_SOON"
    }
]