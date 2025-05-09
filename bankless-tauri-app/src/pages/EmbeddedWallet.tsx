import { usePrivy, useWallets } from '@privy-io/react-auth'
import useSafeWallet from '../hooks/useSafeWallet'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

export default function EmbeddedWallet() {
  const { safeWallet, sendTx } = useSafeWallet()
//   const { login, logout, ready, authenticated } = usePrivy()
//   const { ready: readyWallets, wallets } = useWallets()

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg font-semibold">Welcome {user?.email?.address}</div>
        <button 
          onClick={sendTx} 
          disabled={!safeWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send Tx
        </button>
      </div>
    </div>
  )
} 