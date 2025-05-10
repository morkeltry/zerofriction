import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

// Mock data for the card details
const cardData = {
  name: 'JOHN DOE',
  number: '4562 1122 4594 7852',
  expiry: '05/25',
  cvv: '123',
}

// Mock transaction data
const transactions = [
  { id: 1, merchant: 'Ethereum DApp Store', amount: -50.0, date: '2024-03-20', type: 'purchase' },
  { id: 2, merchant: 'NFT Marketplace', amount: -125.3, date: '2024-03-19', type: 'purchase' },
  { id: 3, merchant: 'Card Top Up', amount: 200.0, date: '2024-03-18', type: 'deposit' },
]

// Virtual Card component that displays the Gnosis credit card
function VirtualCard({ showDetails }: { showDetails: boolean }) {
  return (
    <div className="relative w-full aspect-[1.586/1] max-w-md mx-auto bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-400 rounded-2xl p-6 text-white shadow-xl">
      <div className="absolute top-4 left-6">
        <img src="/gnosis-logo.svg" alt="Gnosis" className="h-12 w-auto" />
      </div>
      <div className="absolute bottom-6 w-[calc(100%-3rem)] space-y-4">
        <div className="text-xl tracking-wider font-mono">
          {showDetails ? cardData.number : '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-75">CARD HOLDER</div>
            <div className="font-medium">{showDetails ? cardData.name : '••••• •••••'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75">EXPIRES</div>
            <div className="font-medium">{showDetails ? cardData.expiry : '••/••'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75">CVV</div>
            <div className="font-medium">{showDetails ? cardData.cvv : '•••'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Transaction list component to display card activity
function TransactionList() {
  return (
    <div className="space-y-4">
      {transactions.map(tx => (
        <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-lg">
          <div>
            <div className="font-medium text-foreground/70">{tx.merchant}</div>
            <div className="text-sm text-foreground/90">{tx.date}</div>
          </div>
          <div className={`font-mono ${tx.amount > 0 ? 'text-green-100' : 'text-red-300'}`}>
            {tx.amount > 0 ? '+' : ''}
            {tx.amount.toFixed(2)} USDC
          </div>
        </div>
      ))}
    </div>
  )
}

// Main card screen component
export function CardScreen() {
  const [showCardDetails, setShowCardDetails] = useState(false)

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <VirtualCard showDetails={showCardDetails} />
        <button
          onClick={() => setShowCardDetails(!showCardDetails)}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          {showCardDetails ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-light tracking-wider mb-4">Recent Transactions</h2>
        <TransactionList />
      </div>
    </div>
  )
}
