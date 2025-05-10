import { useWallets } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { createPublicClient, createWalletClient, custom, type Hex, http } from 'viem'
import { gnosis, mainnet, polygon } from 'viem/chains'

// Define supported chains
const SUPPORTED_CHAINS = {
  ethereum: mainnet,
  polygon,
  gnosis,
} as const

type ChainId = keyof typeof SUPPORTED_CHAINS

interface WalletState {
  walletClient: ReturnType<typeof createWalletClient> | null
  publicClient: ReturnType<typeof createPublicClient> | null
  currentChain: ChainId
  address: string | null
  isConnected: boolean
  error: string | null
}

/**
 * Hook to manage Privy wallet connection and interactions using Viem
 * Supports Ethereum, Polygon, and Gnosis chains
 */
export const usePrivyWallet = () => {
  const { wallets } = useWallets()
  const [state, setState] = useState<WalletState>({
    walletClient: null,
    publicClient: null,
    currentChain: 'ethereum',
    address: null,
    isConnected: false,
    error: null,
  })

  // Initialize wallet connection
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        if (!wallets.length) {
          setState(prev => ({ ...prev, isConnected: false, error: 'No wallet connected' }))
          return
        }

        const wallet = wallets[0]
        const provider = await wallet.getEthereumProvider()

        const walletClient = createWalletClient({
          account: wallet.address as Hex,
          chain: SUPPORTED_CHAINS[state.currentChain],
          transport: custom(provider),
        })

        const publicClient = createPublicClient({
          chain: SUPPORTED_CHAINS[state.currentChain],
          transport: http(),
        })

        setState(prev => ({
          ...prev,
          walletClient,
          publicClient,
          address: wallet.address,
          isConnected: true,
          error: null,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize wallet',
        }))
      }
    }

    initializeWallet()
  }, [wallets])

  /**
   * Switch to a different chain
   * @param chainId - The chain to switch to (ethereum, polygon, or gnosis)
   */
  const switchChain = async (chainId: ChainId) => {
    try {
      if (!wallets.length) {
        throw new Error('No wallet connected')
      }

      const wallet = wallets[0]
      await wallet.switchChain(SUPPORTED_CHAINS[chainId].id)

      const provider = await wallet.getEthereumProvider()
      const walletClient = createWalletClient({
        account: wallet.address as Hex,
        chain: SUPPORTED_CHAINS[chainId],
        transport: custom(provider),
      })

      const publicClient = createPublicClient({
        chain: SUPPORTED_CHAINS[chainId],
        transport: http(),
      })

      setState(prev => ({
        ...prev,
        walletClient,
        publicClient,
        currentChain: chainId,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to switch chain',
      }))
    }
  }

  return {
    ...state,
    switchChain,
    supportedChains: SUPPORTED_CHAINS,
  }
}
