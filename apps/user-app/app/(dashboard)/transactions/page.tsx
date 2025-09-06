import { getServerSession } from "next-auth";
import { OnRampTransactions } from "../../../components/OnRampTransaction"
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
export default async function Transaction() {
    const session = await getServerSession(authOptions)
     const transactions = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user.id), // TODO: replace with session.user.id
    },
    orderBy: {
      startTime: "desc",
    },
    take: 5,
    select: {
      startTime: true,
      amount: true,
      status: true,
      provider: true,
    },
  });

  // Format them for your component
  const formatted = transactions.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));

  return (
    <div className="max-w-xl mx-auto mt-8">
      <OnRampTransactions transactions={formatted} />
    </div>
  );
}
