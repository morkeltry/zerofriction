import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import { ArrowRightLeft, CreditCard, Gift, Coins, Wallet } from 'lucide-react'
import './index.css'

import { BalanceCard } from '@/components/balance-card'
import { BalanceChart } from '@/components/balance-chart'
import { Spinner } from '@/components/spinner'
import { TransactionList } from '@/components/transaction-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { HomeScreen } from '@/screens/home-screen'
import { RampsScreen } from '@/screens/ramps-screen'
import { CardScreen } from '@/screens/card-screen'
import { EarnScreen } from '@/screens/earn-screen'
import { RewardsScreen } from '@/screens/rewards-screen'

// Navigation component that syncs tabs with routes
function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname.substring(1) || 'home'

  return (
    <Tabs value={currentPath} className="w-full">
      <TabsList className="w-full">
        <Link to="/home" className="w-full">
          <TabsTrigger value="home" className="w-full">
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </TabsTrigger>
        </Link>
        <Link to="/ramps" className="w-full">
          <TabsTrigger value="ramps" className="w-full">
            <ArrowRightLeft className="h-5 w-5" />
            <span className="text-xs">Ramps</span>
          </TabsTrigger>
        </Link>
        <Link to="/card" className="w-full">
          <TabsTrigger value="card" className="w-full">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Card</span>
          </TabsTrigger>
        </Link>
        <Link to="/earn" className="w-full">
          <TabsTrigger value="earn" className="w-full">
            <Coins className="h-5 w-5" />
            <span className="text-xs">Earn</span>
          </TabsTrigger>
        </Link>
        <Link to="/rewards" className="w-full">
          <TabsTrigger value="rewards" className="w-full">
            <Gift className="h-5 w-5" />
            <span className="text-xs">Rewards</span>
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}

// Main App component
function App() {
  const { ready } = usePrivy()

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background px-4">
        <div className="pb-24">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/ramps" element={<RampsScreen />} />
            <Route path="/card" element={<CardScreen />} />
            <Route path="/earn" element={<EarnScreen />} />
            <Route path="/rewards" element={<RewardsScreen />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </BrowserRouter>
  )
}

export default App
