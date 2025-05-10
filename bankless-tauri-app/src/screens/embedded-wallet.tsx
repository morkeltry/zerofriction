import React, { useEffect, useState } from "react"
import { usePrivy } from '@privy-io/react-auth'
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia, baseSepolia } from 'viem/chains';
import {  createClient, getClient, convertViemChainToRelayChain, TESTNET_RELAY_API } from "@reservoir0x/relay-sdk"

import useSafeWallet from '../hooks/useSafeWallet'
import { log } from 'node:console'

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
const BASE_SEPOLIA_RPC_URL = 'https://base-sepolia-rpc.publicnode.com'
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
const RELAY_API = 'https://api.relay.link'
const RELAY_TESTNETS_API = 'https://api.testnets.relay.link'

// const PRIVATE_KEY = import.meta.env.PRIVATE_KEY as string;

const SEPOLIA_CHAIN_ID = 11155111
const BASE_SEPOLIA_CHAIN_ID = 84532
const START_CHAIN_ID = SEPOLIA_CHAIN_ID
const BRIDGE_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID

const MILLIETHER = "1000000000000000";

const RELAY_TESTNETS_CONFIG = {
  baseApiUrl: RELAY_TESTNETS_API,
  source: "zerofric",
  chains: [
    // {
    //   id: 11155111,
    //   name: "sepolia",
    //   displayName: "Sepolia",
    //   httpRpcUrl: SEPOLIA_RPC_URL,
    // },
    convertViemChainToRelayChain(sepolia),

    {
      id: 84532,
      name: "base-sepolia",
      displayName: "Base Sepolia",
      httpRpcUrl: BASE_SEPOLIA_RPC_URL,
    },
    convertViemChainToRelayChain(baseSepolia)
  ],
};


async function bridgeEth() {
  console.log('Bridge ETH!');
  
  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = await createWalletClient({
    account,
    chain: sepolia,
    transport: http(SEPOLIA_RPC_URL),
  })

  console.log(account);
  console.log(wallet);

  const client = await getClient()
  console.log(client);

  // Get the bridge quote
  const quote = await client?.actions.getQuote({
    wallet,
    chainId: SEPOLIA_CHAIN_ID,
    toChainId: BASE_SEPOLIA_CHAIN_ID,
    amount: MILLIETHER,
    currency: '0x0000000000000000000000000000000000000000', // Native ETH
    toCurrency: '0x0000000000000000000000000000000000000000', // Native ETH
    tradeType: "EXACT_INPUT",
    recipient: wallet.account.address,
  });


  // Execute bridge transaction
  await getClient()?.actions.execute({
    quote,
    wallet,
    onProgress: (data : any) => {
      const { steps, fees, currentStep, currentStepItem } = data
      console.log(steps, fees, currentStep, currentStepItem);
    },
  });
}


export function EmbeddedWallet() {
  const { safeWallet, sendTx } = useSafeWallet()
  const { user } = usePrivy()

  useEffect(() => {
    createClient(RELAY_TESTNETS_CONFIG)
  }, []);

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

        <button 
          onClick={bridgeEth} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >          
          Bridge 0.001 Sepolia ETH to Base Sepolia

        </button>

      </div>
    </div>
  )
}
