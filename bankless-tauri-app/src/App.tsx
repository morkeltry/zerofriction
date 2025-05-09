// import { useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "@/components/theme-provider"
import './index.css'

import { usePrivy, useLogin, useWallets } from '@privy-io/react-auth'

import { Spinner } from '@/components/spinner'
import useSafeWallet from './hooks/useSafeWallet';
import { useState } from 'react'
import EmbeddedWallet from './pages/EmbeddedWallet'

function App() {
  const { safeWallet, sendTx } = useSafeWallet();
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const { ready, authenticated } = usePrivy()
  const { ready: readyWallets, wallets } = useWallets()
  // const [showWallet, setShowWallet] = useState(false)

  const { login } = useLogin({
    onComplete({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) {
      console.log('🔑 ✅ Login success', {
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        loginAccount
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

  // if (ready && authenticated && readyWallets && wallets.length > 0) {
  //   return <EmbeddedWallet />
  // }

  // Now it's safe to use other Privy hooks and state
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg font-semibold">Privy is ready!</div>
        <button
          onClick={sendTx}
          disabled={!(ready && authenticated && readyWallets && wallets.length > 0)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >Send Tx</button>
        <button
          className='my-4 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
          onClick={login}
          // Always check that Privy is `ready` and the user is not `authenticated` before calling `login`
          disabled={!ready || authenticated}
        >Login</button>
      </div>
    </div>
  )
}

export default App
