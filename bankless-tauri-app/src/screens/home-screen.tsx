import { BalanceCard } from '@/components/balance-card'
import { BalanceCardSkeleton } from '@/components/balance-card-skeleton'
import { BalanceChart } from '@/components/balance-chart'
import { TransactionList } from '@/components/transaction-list'
import { usePrivyWallet } from '@/hooks/use-privy-wallet'
import { useTokenBalances } from '@/hooks/use-token-balances'

// Home screen component
export function HomeScreen() {
  const { address, isConnected } = usePrivyWallet()
  const { balances, isLoading } = useTokenBalances(isConnected ? address : null, 5)
  const total = balances.total

  // Calculate date range for transactions (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  return (
    <div className="space-y-4 py-2 pt-4">
      {isLoading ? (
        <BalanceCardSkeleton />
      ) : (
        <BalanceCard usdBalance={total.usdBalance} eurBalance={total.eurBalance} />
      )}
      <BalanceChart />
      <TransactionList address={address} startDate={startDate} endDate={endDate} />
    </div>
  )
}
