import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

// commented because it throws stack call size error

// export const prisma = new PrismaClient()
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma