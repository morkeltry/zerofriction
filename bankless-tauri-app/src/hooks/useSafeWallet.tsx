import { Safe4337Pack } from '@safe-global/relay-kit'
import { useEffect, useState } from 'react'
import { localstorageKey } from '../utils/localstorage'
import { useWallets } from '@privy-io/react-auth'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

export default function useSafeWallet() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [safeWallet, setSafeWallet] = useState<Safe4337Pack | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(
    localStorage.getItem(localstorageKey) || null
  )
  const { wallets } = useWallets()
  useEffect(() => {
    const initSafeWallet = async () => {
      if (isInitialized) return
      if (!wallets || wallets.length === 0) {
        console.log('No wallets available')
        return
      }
      const ethereumProvider = await wallets[0].getEthereumProvider()

      const provider = createWalletClient({
        chain: sepolia,
        transport: custom(ethereumProvider),
      })

      const signer = wallets[0].address

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
          sponsorshipPolicyId: 'sp_fantastic_baron_zemo',
        },
      })
      setSafeWallet(safeWallet)
      setIsInitialized(true)
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
