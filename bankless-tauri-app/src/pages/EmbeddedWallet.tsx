import { usePrivy } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { getClient } from "@reservoir0x/relay-sdk"
import useSafeWallet from '../hooks/useSafeWallet'

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
const SEED_PHRASE = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const wallet = new ethers.Wallet(SEED_PHRASE)

const SEPOLIA_CHAIN_ID = 11155111
const BASE_SEPOLIA_CHAIN_ID = 84532
const START_CHAIN_ID = SEPOLIA_CHAIN_ID
const BRIDGE_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID

const MILLIETHER = ethers.parseUnits('0.001', 18).toString();


async function bridgeEth() {
  {/* Get bridge quote */}
  const quote = await getClient()?.actions.getQuote({
    wallet,
    chainId: SEPOLIA_CHAIN_ID,
    toChainId: BASE_SEPOLIA_CHAIN_ID,
    amount: MILLIETHER,
    currency: '0x0000000000000000000000000000000000000000', // Native ETH
    toCurrency: '0x0000000000000000000000000000000000000000', // Native ETH
    recipient: await wallet.getAddress(),
  });

  {/* Execute bridge transaction */}
  await getClient()?.actions.execute({
    quote,
    wallet,
    onProgress: (steps: any, fees: any, currentStep: any, currentStepItem: any) => {
      console.log(steps, fees, currentStep, currentStepItem);
    },
  });
}


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

        <button 
          onClick={bridgeEth} 
          disabled={!safeWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >          
          Bridge 0.001 Sepolia ETH to Base Sepolia

        </button>

      </div>
    </div>
  )
} 