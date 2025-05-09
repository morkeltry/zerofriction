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
        <button onClick={sendTx} disabled={!safeWallet}></button>
        <Spinner />
      </div>
    )
  }

  // Now it's safe to use other Privy hooks and state
  return <div className="flex h-screen w-screen items-center justify-center">Privy is ready!</div>
}

export default App
