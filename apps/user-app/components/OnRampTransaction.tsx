import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
             {transactions.map(t => <div className="flex justify-between p-4 border-b">
                            <div>
                                <div className="text-sm">{t.provider}</div>
                                <div className="text-xs text-gray-500">{t.time.toString()}</div>
                            </div>
                            <div>
                                <div className="text-sm">+Rs {t.amount/100}</div>
                                <div className="text-xs text-gray-500">{t.status}</div>
                            </div>
                        </div>)}
        </div>
    </Card>
}