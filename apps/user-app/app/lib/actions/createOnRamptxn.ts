"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount:number, provider:string) {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    const token = Math.random().toString();
    if(!userId) {
       return{
        message : "user not logged in"
       }
    }
    await prisma.onRampTransaction.create({
        data : {
            userId,
            amount : amount,
            status : "Processing",
            startTime : new Date(),
            provider,
            token : token
        }
    })
    return{
        message : "Transaction created successfully"
    }
}