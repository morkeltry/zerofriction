const aaveSepolia = {
  pool: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
  usdc: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  weth: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
}

const wethABI = [
  'function deposit() payable public',
  'function withdraw(uint256 wad) public',
  'function balanceOf(address guy) public view returns (uint256 wad)',
]

const poolABI = [
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public virtual override',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) public virtual override',
]

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
]

export default function useAave() {}
