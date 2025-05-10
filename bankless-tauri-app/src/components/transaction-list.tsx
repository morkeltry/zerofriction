import { ArrowDownRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import { useTransactions } from '../hooks/use-transactions'

// Helper function to format date and time
const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

// Helper function to get block explorer URL based on chain ID
const getBlockExplorerUrl = (
  chainId: 'ethereum' | 'polygon' | 'gnosis',
  txHash: string
): string => {
  const explorers: Record<'ethereum' | 'polygon' | 'gnosis', string> = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    gnosis: 'https://gnosisscan.io/tx/',
  }
  return explorers[chainId] ? `${explorers[chainId]}${txHash}` : '#'
}

interface TransactionListProps {
  address: string | null
  startDate: Date
  endDate: Date
}

// Component to display the list of transactions
export const TransactionList = ({ address, startDate, endDate }: TransactionListProps) => {
  const { transactions } = useTransactions({
    address,
    startDate,
    endDate,
  })

  //   console.log({ transactions, isLoading, error })

  //   if (isLoading) {
  //     return (
  //       <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
  //         <div className="mb-6">
  //           <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
  //         </div>
  //         <div className="text-center text-muted-foreground">Loading transactions...</div>
  //       </div>
  //     )
  //   }

  //   if (error) {
  //     return (
  //       <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
  //         <div className="mb-6">
  //           <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
  //         </div>
  //         <div className="text-center text-destructive">{error}</div>
  //       </div>
  //     )
  //   }

  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
        </div>
        <div className="text-center text-muted-foreground">No transactions found</div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-xs font-medium text-muted-foreground">Recent Transactions</h3>
      </div>

      <div className="space-y-2">
        {transactions.map(tx => {
          const { date, time } = formatDateTime(tx.timestamp)
          const isReceived = tx.to.toLowerCase() === address?.toLowerCase()

          return (
            <a
              key={tx.hash}
              href={getBlockExplorerUrl(tx.chainId, tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-card/50 mt-6 backdrop-blur-sm transition-colors hover:bg-card/80 p-3 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-1.5 ${
                    isReceived ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'
                  }`}
                >
                  {isReceived ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {/* {isReceived ? 'Received' : 'Sent'}{' '} */}
                    {tx.tokenSymbol.length > 10
                      ? `${tx.tokenSymbol.slice(0, 10)}...`
                      : tx.tokenSymbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isReceived
                      ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                      : `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isReceived ? '+' : '-'}
                    {tx.value}{' '}
                    {tx.tokenSymbol.length > 4
                      ? `${tx.tokenSymbol.slice(0, 4)}...`
                      : tx.tokenSymbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {date} {time}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
