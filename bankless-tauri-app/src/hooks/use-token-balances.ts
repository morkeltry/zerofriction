import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPublicClient, erc20Abi, formatUnits, http } from 'viem'
import { gnosis, mainnet, polygon } from 'viem/chains'

// Token addresses for different chains
const TOKENS = {
  ethereum: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    EURC: '0x1abaea1f7c830bd89acc67ec4af516284b1bc33c',
    EURe: '0x39b8B6385416f4cA36a20319F70D28621895279D',
  },
  polygon: {
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    EURe: '0xE0aEa583266584DafBB3f9C3211d5588c73fEa8d',
  },
  gnosis: {
    USDC: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    EURe: '0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430',
  },
} as const

// Token decimals
const TOKEN_DECIMALS = {
  USDC: 6,
  EURC: 6,
  EURe: 6,
} as const

type TokenSymbol = keyof typeof TOKEN_DECIMALS
type ChainId = keyof typeof TOKENS

// Group tokens by type
const USD_TOKENS: TokenSymbol[] = ['USDC']
const EUR_TOKENS: TokenSymbol[] = ['EURC', 'EURe']

interface TokenBalance {
  symbol: TokenSymbol
  balance: string
  decimals: number
  chainId: ChainId
}

interface ChainBalances {
  usdBalance: string
  eurBalance: string
  nativeBalance: string
  tokenBalances: TokenBalance[]
}

interface AllBalances {
  chains: Record<ChainId, ChainBalances>
  total: ChainBalances
}

// Create public clients for each chain - moved inside hook for proper memoization
const createPublicClients = () => ({
  ethereum: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  polygon: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  gnosis: createPublicClient({
    chain: gnosis,
    transport: http(),
  }),
})

/**
 * Hook to fetch and manage token balances across all supported chains
 * Returns both per-chain balances and aggregated totals
 * @param address - The address to fetch balances for
 * @param pollingInterval - Optional polling interval in seconds. If provided, balances will be fetched every X seconds
 */
export const useTokenBalances = (address: string | null, pollingInterval?: number) => {
  const [isLoading, setIsLoading] = useState(false)
  const [balances, setBalances] = useState<AllBalances>({
    chains: {
      ethereum: { usdBalance: '0', eurBalance: '0', nativeBalance: '0', tokenBalances: [] },
      polygon: { usdBalance: '0', eurBalance: '0', nativeBalance: '0', tokenBalances: [] },
      gnosis: { usdBalance: '0', eurBalance: '0', nativeBalance: '0', tokenBalances: [] },
    },
    total: { usdBalance: '0', eurBalance: '0', nativeBalance: '0', tokenBalances: [] },
  })

  // Memoize public clients to prevent recreation on each render
  const publicClients = useMemo(() => createPublicClients(), [])

  // Track previous address to prevent unnecessary refetches
  const prevAddressRef = useRef<string | null>(null)

  // Store interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchBalances = useCallback(
    async (isPolling = false) => {
      if (!address) return

      // Skip if address hasn't changed
      if (!pollingInterval && prevAddressRef.current === address) return
      prevAddressRef.current = address

      // Only update loading state for non-polling requests
      if (!isPolling) {
        setIsLoading(true)
      }

      try {
        const chainBalances: Record<ChainId, ChainBalances> = {} as Record<ChainId, ChainBalances>
        let totalUsdBalance = 0n
        let totalEurBalance = 0n
        let totalNativeBalance = 0n
        const allTokenBalances: TokenBalance[] = []

        // Fetch balances for each chain
        for (const chainId of Object.keys(TOKENS) as ChainId[]) {
          const publicClient = publicClients[chainId]
          if (!publicClient) continue

          const tokenBalances: TokenBalance[] = []
          let chainUsdBalance = 0n
          let chainEurBalance = 0n

          try {
            // Fetch native token balance
            const nativeBalance = await publicClient.getBalance({ address })
            const formattedNativeBalance = formatUnits(nativeBalance, 18)
            totalNativeBalance += nativeBalance

            // Fetch balances for all tokens on the current chain
            for (const [symbol, tokenAddress] of Object.entries(TOKENS[chainId])) {
              try {
                // First check if the contract exists and has the balanceOf function
                const code = await publicClient.getBytecode({
                  address: tokenAddress as `0x${string}`,
                })
                if (!code || code === '0x') {
                  console.warn(`No contract found at ${tokenAddress} on ${chainId}`)
                  continue
                }

                const balance = await publicClient.readContract({
                  address: tokenAddress as `0x${string}`,
                  abi: erc20Abi,
                  functionName: 'balanceOf',
                  args: [address],
                })

                const decimals = TOKEN_DECIMALS[symbol as TokenSymbol]
                const formattedBalance = formatUnits(balance, decimals)

                const tokenBalance: TokenBalance = {
                  symbol: symbol as TokenSymbol,
                  balance: formattedBalance,
                  decimals,
                  chainId,
                }

                tokenBalances.push(tokenBalance)
                allTokenBalances.push(tokenBalance)

                // Add to chain and total USD or EUR balance
                if (USD_TOKENS.includes(symbol as TokenSymbol)) {
                  chainUsdBalance += balance
                  totalUsdBalance += balance
                } else if (EUR_TOKENS.includes(symbol as TokenSymbol)) {
                  chainEurBalance += balance
                  totalEurBalance += balance
                }
              } catch (error) {
                console.warn(`Error fetching balance for ${symbol} on ${chainId}:`, error)
              }
            }

            chainBalances[chainId] = {
              usdBalance: formatUnits(chainUsdBalance, 6),
              eurBalance: formatUnits(chainEurBalance, 6),
              nativeBalance: formattedNativeBalance,
              tokenBalances,
            }
          } catch (error) {
            console.error(`Error fetching balances for chain ${chainId}:`, error)
            // Set default values for this chain
            chainBalances[chainId] = {
              usdBalance: '0',
              eurBalance: '0',
              nativeBalance: '0',
              tokenBalances: [],
            }
          }
        }

        setBalances({
          chains: chainBalances,
          total: {
            usdBalance: formatUnits(totalUsdBalance, 6),
            eurBalance: formatUnits(totalEurBalance, 6),
            nativeBalance: formatUnits(totalNativeBalance, 18),
            tokenBalances: allTokenBalances,
          },
        })
      } catch (error) {
        console.error('Error fetching token balances:', error)
      } finally {
        // Only update loading state for non-polling requests
        if (!isPolling) {
          setIsLoading(false)
        }
      }
    },
    [address, publicClients, pollingInterval]
  )

  // Memoize the balances object to prevent unnecessary re-renders
  const memoizedBalances = useMemo(() => balances, [balances])

  // Setup polling if pollingInterval is provided
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial fetch (not polling)
    fetchBalances(false)

    // Setup new interval if pollingInterval is provided
    if (pollingInterval && address) {
      intervalRef.current = setInterval(() => {
        console.log('re-fetching balances...')
        fetchBalances(true)
      }, pollingInterval * 1000) // Convert seconds to milliseconds
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchBalances, pollingInterval, address])

  return { balances: memoizedBalances, isLoading }
}
