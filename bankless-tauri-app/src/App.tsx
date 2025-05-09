// import { useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "@/components/theme-provider"
import './index.css'

import { usePrivy } from '@privy-io/react-auth'

import { Spinner } from '@/components/spinner'
import useSafeWallet from './hooks/useSafeWallet';

function App() {
  const { safeWallet, sendTx } = useSafeWallet();
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const { ready } = usePrivy()

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Now it's safe to use other Privy hooks and state
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg font-semibold">Privy is ready!</div>
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

export default App
