import './index.css'

import { useLogin, usePrivy } from '@privy-io/react-auth'
import { ArrowRightLeft, Coins, CreditCard, Gift, Wallet } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { Spinner } from '@/components/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CardScreen } from '@/screens/card-screen'
import { EarnScreen } from '@/screens/earn-screen'
import { EmbeddedWallet } from '@/screens/embedded-wallet'
import { HomeScreen } from '@/screens/home-screen'
import { RampsScreen } from '@/screens/ramps-screen'
import { RewardsScreen } from '@/screens/rewards-screen'

// import useSafeWallet from './hooks/useSafeWallet'

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
  const { ready, authenticated } = usePrivy()
  // const { safeWallet, sendTx } = useSafeWallet()
  // if (showWallet) {
  //   return <EmbeddedWallet />
  // }

  const { login } = useLogin({
    onComplete({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) {
      console.log('🔑 ✅ Login success', {
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        loginAccount,
      })
      // setShowWallet(true)
    },
    onError(error) {
      console.log('🔑 🚨 Login error', { error })
    },
  })

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-semibold">Privy is ready!</div>
          <button
            className="my-4 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400"
            onClick={login}
            // Always check that Privy is `ready` and the user is not `authenticated` before calling `login`
            disabled={!ready || authenticated}
          >
            Login
          </button>
        </div>
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
            <Route path="/testscreen" element={<EmbeddedWallet />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </BrowserRouter>
  )
}

export default App
