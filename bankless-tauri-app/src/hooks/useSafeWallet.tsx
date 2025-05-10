import { Safe4337Pack } from '@safe-global/relay-kit'
import { useEffect, useState } from 'react'

import { getLocalStorageKey } from '../utils/localstorage'
import useAave, { aaveSepolia } from './useAave'
import { useWallets } from '@privy-io/react-auth'
import { Chain, createWalletClient, custom } from 'viem'

export const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
// const WALLET = new Wallet(SEED_PHRASE)

export default function useSafeWallet(chain: Chain) {
  const {
    wrapETH,
    depositIntoAave,
    getApproveToken,
    borrowFromAave,
    setUserUseReserveAsCollateral,
  } = useAave()
  const [safeWallet, setSafeWallet] = useState<Safe4337Pack | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(
    localStorage.getItem(getLocalStorageKey(chain)) || null
  )

  const { ready: readyWallets, wallets } = useWallets()
  useEffect(() => {
    if (!readyWallets || wallets.length === 0) {
      console.log('No wallets available')
      return
    }

    const initSafeWallet = async () => {
      const ethereumProvider = await wallets[0].getEthereumProvider()

      const provider = createWalletClient({
        chain: chain,
        transport: custom(ethereumProvider)
      })
      const signer = wallets[0].address
      const safeWallet = await Safe4337Pack.init({
        provider: provider as any,
        signer: signer,
        bundlerUrl: `https://api.pimlico.io/v2/${chain.id}/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
        options: {
          owners: [wallets[0].address],
          threshold: 1,
        },
        paymasterOptions: {
          isSponsored: true,
          paymasterUrl: `https://api.pimlico.io/v2/${chain.id}/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
          sponsorshipPolicyId: 'sp_fantastic_baron_zemo',
        },
      })
      setSafeWallet(safeWallet)
    }
    initSafeWallet()
  }, [wallets])

  const sendTx = async () => {
    if (safeWallet) {
      safeWallet.signSafeOperation
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
      localStorage.setItem(getLocalStorageKey(chain), userOperationReceipt.sender)
      setSafeAddress(userOperationReceipt.sender)
      console.log(txHash, userOperationReceipt)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  const depositIntoAaveFromSafe = async (asset: 'WETH' | 'USDC', amount: string) => {
    if (safeWallet && safeAddress) {
      const tx = await safeWallet.createTransaction({
        transactions: [
          {
            to: asset === 'WETH' ? aaveSepolia.weth : aaveSepolia.usdc,
            value: '0',
            data: getApproveToken(asset, amount),
          },
          {
            to: aaveSepolia.pool,
            value: '0',
            data: depositIntoAave(
              asset === 'WETH' ? aaveSepolia.weth : aaveSepolia.usdc,
              safeAddress,
              amount
            ),
          },
        ],
      })
      const signed = await safeWallet.signSafeOperation(tx)
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      })
      fetchTxHash(txHash)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  const borrowFromAaveFromSafe = async (asset: 'WETH' | 'USDC', amount: string) => {
    if (safeWallet && safeAddress) {
      const tx = await safeWallet.createTransaction({
        transactions: [
          {
            to: aaveSepolia.pool,
            value: '0',
            data: borrowFromAave(
              asset === 'WETH' ? aaveSepolia.weth : aaveSepolia.usdc,
              safeAddress,
              amount
            ),
          },
        ],
      })
      const signed = await safeWallet.signSafeOperation(tx)
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      })
      fetchTxHash(txHash)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  const wrapETHFromSafe = async () => {
    if (safeWallet) {
      const tx = await safeWallet.createTransaction({
        transactions: [{ to: aaveSepolia.weth, value: '8999999999999', data: wrapETH() }],
      })
      const signed = await safeWallet.signSafeOperation(tx)
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      })
      fetchTxHash(txHash)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  const fetchTxHash = async (txHash: string) => {
    if (safeWallet) {
      let userOperationReceipt = null
      while (!userOperationReceipt) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        userOperationReceipt = await safeWallet.getUserOperationReceipt(txHash)
      }
      localStorage.setItem(getLocalStorageKey(chain), userOperationReceipt.sender)
      setSafeAddress(userOperationReceipt.sender)
      console.log(txHash, userOperationReceipt)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }

  const setUserUseReserveAsCollateralFromSafe = async (
    asset: 'WETH' | 'USDC',
    useAsCollateral: boolean
  ) => {
    if (safeWallet && safeAddress) {
      const tx = await safeWallet.createTransaction({
        transactions: [
          {
            to: aaveSepolia.pool,
            value: '0',
            data: setUserUseReserveAsCollateral(
              asset === 'WETH' ? aaveSepolia.weth : aaveSepolia.usdc,
              useAsCollateral
            ),
          },
        ],
      })
      const signed = await safeWallet.signSafeOperation(tx)
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      })
      fetchTxHash(txHash)
    } else {
      throw new Error('Safe wallet not initialized')
    }
  }
  return {
    safeWallet,
    sendTx,
    safeAddress,
    wrapETHFromSafe,
    fetchTxHash,
    depositIntoAaveFromSafe,
    borrowFromAaveFromSafe,
    setUserUseReserveAsCollateralFromSafe,
  }
}
