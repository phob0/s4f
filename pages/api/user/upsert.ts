import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"
// TODO deprecate soon because login endpoint is created
interface TasksUsers {
  userID: number,
  taskID: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {address, signature, expiresAt} = req.body

  if (address !== "") {

    const tasks = await prisma.task.findMany({
      where: {
        status: "NEW"
      },
      select: {
        id: true
      }
    })

    const user = await prisma.user.upsert({
      where: {
        address: address
      },
      update: {
        signature: signature,
        expiresAt: expiresAt
      },
      create: {
        address: address,
        signature: signature,
        expiresAt: expiresAt
      }
    })

    let tasksUser:Array<TasksUsers> = []

    tasks.forEach(function (value) {
      tasksUser.push({
        userID: Number(user?.id),
        taskID: value.id
      })
    })

    const query = {
      where: {
        userID: Number(user?.id),
        taskID: {
          in: tasks.map(task => task.id)
        }
      }
    }

    const [pivot, countPivot] = await prisma.$transaction([
      prisma.tasksOnUsers.findMany(query),
      prisma.tasksOnUsers.count(query)
    ]);

    const dataFiltered = countPivot != 0 ? tasksUser.filter(entry => entry.taskID !== pivot.find(item => item.taskID == entry.taskID)?.taskID) : tasksUser

    await prisma.tasksOnUsers.createMany({
      data: dataFiltered
    })

    res.status(200).json({ success: true, user: user });
  } else {
    res.status(422).json({ error: "No user address is provided." });
  }
 
}