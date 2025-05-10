import { Contract, providers } from 'ethers'

import { SEPOLIA_RPC_URL } from './useSafeWallet'

export const aaveSepolia = {
  pool: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
  usdc: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  weth: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
  aWeth: '0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830',
}
const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
]

const wethABI = [
  'function deposit() payable public',
  'function withdraw(uint256 wad) public',
  'function balanceOf(address guy) public view returns (uint256 wad)',
].concat(erc20Abi)

const poolABI = [
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) public',
  'function setUserUseReserveAsCollateral(address asset, bool useAsCollateral) public',
  'function withdraw(address asset, uint256 amount, address to) public returns (uint256)',
]

const poolContract = new Contract(aaveSepolia.pool, poolABI)
const wethContract = new Contract(aaveSepolia.weth, wethABI)
const usdcContract = new Contract(aaveSepolia.usdc, erc20Abi)

export default function useAave() {
  const setUserUseReserveAsCollateral = (asset: string, useAsCollateral: boolean) => {
    return poolContract.interface.encodeFunctionData('setUserUseReserveAsCollateral', [
      asset,
      useAsCollateral,
    ])
  }

  const depositIntoAave = (asset: string, address: string, amount: string) => {
    return poolContract.interface.encodeFunctionData('supply', [asset, amount, address, 0])
  }

  const borrowFromAave = (asset: string, address: string, amount: string) => {
    return poolContract.interface.encodeFunctionData('borrow', [asset, amount, 2, 0, address])
  }

  const withdrawFromAave = (asset: string, address: string, amount: string) => {
    return poolContract.interface.encodeFunctionData('withdraw', [asset, amount, address])
  }

  const wrapETH = () => {
    return wethContract.interface.encodeFunctionData('deposit', [])
  }

  const unwrapETH = (amount: string) => {
    return wethContract.interface.encodeFunctionData('withdraw', [amount])
  }

  const getTokenBalance = async (token: 'WETH' | 'USDC' | 'aWETH', address: string) => {
    const contract = new Contract(
      token === 'WETH'
        ? aaveSepolia.weth
        : token === 'aWETH'
          ? aaveSepolia.aWeth
          : aaveSepolia.usdc,
      erc20Abi,
      new providers.JsonRpcProvider(SEPOLIA_RPC_URL)
    )
    const balance = await contract.balanceOf(address)
    return balance
  }

  const getApproveToken = (asset: 'WETH' | 'USDC', amount: string) => {
    return (asset === 'WETH' ? wethContract : usdcContract).interface.encodeFunctionData(
      'approve',
      [aaveSepolia.pool, amount]
    )
  }

  return {
    depositIntoAave,
    borrowFromAave,
    wrapETH,
    unwrapETH,
    getTokenBalance,
    getApproveToken,
    setUserUseReserveAsCollateral,
    withdrawFromAave,
  }
}
