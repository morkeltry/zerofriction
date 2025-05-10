import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'

// Default API keys
const DEFAULT_API_KEYS = {
  etherscan: 'QWJAA3E39HJEE1S8ZYCSUU7TIYRRC5IE5D',
  polygonScan: '9ATGK3DZ3946R5S9ZKCSMEX17NG563Z5XE', // Replace with your PolygonScan API key
  gnosisScan: 'QJM7TF5IRKJGK6V8DTAH759SVX493RF984', // Replace with your GnosisScan API key
} as const

// Types for transaction data
interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  blockNumber: number
  chainId: 'ethereum' | 'polygon' | 'gnosis'
  status: 'success' | 'failed'
  tokenSymbol: string
  tokenName: string
  tokenDecimal: number
  contractAddress: string
}

interface UseTransactionsProps {
  address: string | null
  startDate: Date
  endDate: Date
  pollingInterval?: number // in seconds
  apiKeys?: {
    etherscan?: string
    polygonScan?: string
    gnosisScan?: string
  }
}

interface UseTransactionsReturn {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

// Helper function to convert date to Unix timestamp
const toUnixTimestamp = (date: Date): number => Math.floor(date.getTime() / 1000)

// Memoized helper function to format transaction value
const formatTransactionValue = (value: string, decimals: number = 18): string => {
  try {
    return formatUnits(BigInt(value), decimals)
  } catch (error) {
    return '0'
  }
}

// Generic function to fetch and process transactions from any Etherscan-like API
const fetchTransactionsFromAPI = async (
  address: string,
  startTimestamp: number,
  endTimestamp: number,
  apiKey: string,
  apiUrl: string,
  chainId: 'ethereum' | 'polygon' | 'gnosis'
): Promise<Transaction[]> => {
  const response = await fetch(
    `${apiUrl}?module=account&action=tokentx&address=${address}&sort=desc&apikey=${apiKey}`
  )
  const data = await response.json()

  // Handle API errors
  if (data.status === '0' && data.message !== 'No transactions found') {
    throw new Error(data.message || `Failed to fetch ${chainId} token transactions`)
  }

  // If no transactions found, return empty array instead of throwing
  if (!data.result || data.result.length === 0) {
    return []
  }

  // Use a Map to ensure unique transactions by hash
  const uniqueTransactions = new Map<string, Transaction>()

  data.result.forEach((tx: any) => {
    const txTimestamp = parseInt(tx.timeStamp)
    if (txTimestamp >= startTimestamp && txTimestamp <= endTimestamp) {
      uniqueTransactions.set(tx.hash, {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: formatTransactionValue(tx.value, parseInt(tx.tokenDecimal)),
        timestamp: txTimestamp,
        blockNumber: parseInt(tx.blockNumber),
        chainId,
        status: tx.isError === '0' ? 'success' : 'failed',
        tokenSymbol: tx.tokenSymbol,
        tokenName: tx.tokenName,
        tokenDecimal: parseInt(tx.tokenDecimal),
        contractAddress: tx.contractAddress,
      })
    }
  })

  return Array.from(uniqueTransactions.values())
}

export function useTransactions({
  address,
  startDate,
  endDate,
  pollingInterval = 10,
  apiKeys = {},
}: UseTransactionsProps): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize address to prevent unnecessary refetches when reference changes
  const stableAddress = useMemo(() => address, [address?.toLowerCase()])

  // Memoize timestamps to prevent unnecessary recalculations
  const { startTimestamp, endTimestamp } = useMemo(
    () => ({
      startTimestamp: toUnixTimestamp(startDate),
      endTimestamp: toUnixTimestamp(endDate),
    }),
    [startDate.getTime(), endDate.getTime()]
  )

  // Memoize API configurations with fallback to default keys
  const apiConfigs = useMemo(
    () => [
      {
        url: 'https://api.etherscan.io/api',
        key: apiKeys.etherscan || DEFAULT_API_KEYS.etherscan,
        chainId: 'ethereum' as const,
      },
      {
        url: 'https://api.polygonscan.com/api',
        key: apiKeys.polygonScan || DEFAULT_API_KEYS.polygonScan,
        chainId: 'polygon' as const,
      },
      {
        url: 'https://api.gnosisscan.io/api',
        key: apiKeys.gnosisScan || DEFAULT_API_KEYS.gnosisScan,
        chainId: 'gnosis' as const,
      },
    ],
    [apiKeys.etherscan, apiKeys.polygonScan, apiKeys.gnosisScan]
  )

  // Memoized fetch function that returns a promise
  const fetchTransactions = useCallback(async () => {
    if (!stableAddress) return []

    try {
      // Fetch transactions from all chains in parallel
      const results = await Promise.all(
        apiConfigs.map(config =>
          fetchTransactionsFromAPI(
            stableAddress,
            startTimestamp,
            endTimestamp,
            config.key,
            config.url,
            config.chainId
          )
        )
      )

      // Combine all transactions and sort by date/time (newest first)
      return results.flat().sort((a, b) => b.timestamp - a.timestamp)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch transactions')
    }
  }, [stableAddress, startTimestamp, endTimestamp, apiConfigs])

  // Memoized polling interval
  const pollingIntervalMs = useMemo(
    () => (pollingInterval > 0 ? pollingInterval * 1000 : 0),
    [pollingInterval]
  )

  // Effect for initial fetch and polling setup
  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout | undefined

    const fetchAndUpdate = async () => {
      if (!stableAddress) {
        setTransactions([])
        setIsLoading(false)
        setError('No address provided')
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const newTransactions = await fetchTransactions()
        if (mounted) {
          setTransactions(newTransactions)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Initial fetch
    fetchAndUpdate()

    // Set up polling if interval is provided
    if (pollingIntervalMs > 0) {
      intervalId = setInterval(fetchAndUpdate, pollingIntervalMs)
    }

    // Cleanup
    return () => {
      mounted = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [stableAddress, startTimestamp, endTimestamp, fetchTransactions, pollingIntervalMs])

  return { transactions, isLoading, error }
}
