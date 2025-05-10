import { BalanceCard } from '@/components/balance-card'
import { BalanceChart } from '@/components/balance-chart'
import { TransactionList } from '@/components/transaction-list'

// Home screen component
export function HomeScreen() {
  return (
    <div className="space-y-6 py-6">
      <BalanceCard />
      <BalanceChart />
      <TransactionList />
    </div>
  )
}
