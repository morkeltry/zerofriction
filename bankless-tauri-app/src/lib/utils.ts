import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency with appropriate symbol and decimal places
 * @param amount - The amount to format
 * @param currency - The currency code (USD, EUR, ETH, MATIC, xDAI)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string): string {
  // Define currency-specific formatting options
  const options: Record<string, { symbol: string; decimals: number }> = {
    USD: { symbol: '$', decimals: 2 },
    EUR: { symbol: '€', decimals: 2 },
    ETH: { symbol: 'Ξ', decimals: 4 },
    MATIC: { symbol: 'MATIC', decimals: 4 },
    xDAI: { symbol: 'xDAI', decimals: 4 },
  }

  // Get formatting options for the currency, default to USD if not found
  const { symbol, decimals } = options[currency] || options.USD

  // Format the number with appropriate decimal places
  const formattedAmount = amount.toFixed(decimals)

  // Add thousand separators
  const parts = formattedAmount.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Return formatted string with currency symbol
  return `${symbol}${parts.join('.')}`
}
