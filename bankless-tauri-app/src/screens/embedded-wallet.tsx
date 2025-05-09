import { usePrivy } from '@privy-io/react-auth'

import useSafeWallet from '../hooks/useSafeWallet'

export default function EmbeddedWallet() {
  const { safeWallet, sendTx } = useSafeWallet()
  const { user } = usePrivy()

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
