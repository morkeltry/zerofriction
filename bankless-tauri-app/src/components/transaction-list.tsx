import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

// Sample transaction data
const transactions = [
  {
    id: 1,
    type: 'received',
    amount: 500,
    from: '0x1234...5678',
    date: '2024-03-20',
    time: '14:30',
  },
  {
    id: 2,
    type: 'sent',
    amount: 250,
    to: '0x8765...4321',
    date: '2024-03-19',
    time: '09:15',
  },
  // Add more sample transactions as needed
]

// Component to display the list of transactions
export const TransactionList = () => {
  return (
    <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
      </div>

      <div className="space-y-4">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-2xl bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-card/80"
          >
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-2 ${
                  tx.type === 'received'
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                {tx.type === 'received' ? (
                  <ArrowDownRight className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {tx.type === 'received' ? 'Received' : 'Sent'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.type === 'received' ? `From ${tx.from}` : `To ${tx.to}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">
                {tx.type === 'received' ? '+' : '-'}${tx.amount}
              </p>
              <p className="text-sm text-muted-foreground">
                {tx.date} {tx.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
