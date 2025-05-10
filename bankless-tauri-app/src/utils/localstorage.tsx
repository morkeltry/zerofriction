import { Chain } from "viem"

const localstorageKey = 'safeAddress_zerofriction'

export function getLocalStorageKey(chain: Chain) {
  return `${localstorageKey}_${chain.id}`
}