import { Safe4337Pack } from '@safe-global/relay-kit'
import { Wallet } from 'ethers'
import { useEffect, useState } from 'react'
import { localstorageKey } from '../utils/localstorage'
import { useWallets, usePrivy } from '@privy-io/react-auth'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
const SEED_PHRASE = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const WALLET = new Wallet(SEED_PHRASE)

export default function useSafeWallet() {
  const [safeWallet, setSafeWallet] = useState<Safe4337Pack | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(
    localStorage.getItem(localstorageKey) || null
  )
  const { signMessage} = usePrivy()
  const { wallets } = useWallets()
  useEffect(() => {
    const initSafeWallet = async () => {
      if (!wallets || wallets.length === 0) {
        console.log('No wallets available')
        return
      }

      // console.log(signMessage({ message: "jjljljlj" }));

      const ethereumProvider = await wallets[0].getEthereumProvider()

      const provider = createWalletClient({
        chain: sepolia,
        transport: custom(ethereumProvider)
      })

      const signer = wallets[0].address
      console.log("Singer:",signer);
  
      const safeWallet = await Safe4337Pack.init({
        provider: provider as any,
        signer: signer,
        bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
        options: {
          owners: [wallets[0].address],
          threshold: 1,
        },
        paymasterOptions: {
          isSponsored: true,
          paymasterUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
          //   paymasterAddress: '0x...',
          //   paymasterTokenAddress: '0x...',
          sponsorshipPolicyId: 'sp_fantastic_baron_zemo',
        },
      })
      setSafeWallet(safeWallet)
    }
    initSafeWallet()
  }, [wallets])

  const sendTx = async () => {
    if (safeWallet) {
      const txs = await safeWallet.createTransaction({
        transactions: [
          {
            to: '0xd0B19109DD194fe366f2d2dA34B3C22Dabb1Cb0b',
            value: '0',
            data: '0x',
          },
        ],
      })
      const signed = await safeWallet.signSafeOperation(txs)
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      })
      let userOperationReceipt = null

      while (!userOperationReceipt) {
        // Wait 2 seconds before checking the status again
        await new Promise(resolve => setTimeout(resolve, 2000))
        userOperationReceipt = await safeWallet.getUserOperationReceipt(txHash)
      }
      localStorage.setItem(localstorageKey, userOperationReceipt.sender)
      setSafeAddress(userOperationReceipt.sender)
      console.log(txHash, userOperationReceipt)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  return { safeWallet, sendTx, safeAddress }
}
