import { ArrowDownRight, ArrowUpRight, Copy } from 'lucide-react'

import { Button } from '../components/ui/button'

// Types for ramp data
type BaseRamp = {
  id: number
  name: string
  fromAsset: string
  toAsset: string
  rate?: string
  limits: string
}

type OnRamp = BaseRamp & {
  iban?: string
  reference?: string
  provider?: string
}

type OffRamp = BaseRamp & {
  iban?: string
  holder?: string
  accountNumber?: string
  swift?: string
  walletAddress: string // Required field for offramps
}

// Sample ramp data with fiat and stablecoin pairs
const ramps: {
  onramps: OnRamp[]
  offramps: OffRamp[]
} = {
  onramps: [
    {
      id: 1,
      name: 'Bank Transfer (SEPA)',
      fromAsset: 'EUR',
      toAsset: 'USDC',
      rate: '1 EUR ≈ 1.08 USDC',
      iban: 'ES91 2100 0418 4502 0005 1332',
      reference: 'ON-123456',
      limits: '€1,000 - €10,000 / day',
    },
    {
      id: 2,
      name: 'Credit Card',
      fromAsset: 'USD',
      toAsset: 'USDT',
      rate: '1 USD ≈ 1 USDT',
      provider: 'Stripe',
      limits: '$50 - $5,000 / day',
    },
  ],
  offramps: [
    {
      id: 1,
      name: 'Bank Account (SEPA)',
      fromAsset: 'USDC',
      toAsset: 'EUR',
      rate: '1 USDC ≈ 0.93 EUR',
      iban: 'ES91 2100 0418 4502 0005 1332',
      holder: 'John Doe',
      limits: '1,000 - 10,000 USDC / day',
      walletAddress: '0x1234...5678', // USDC wallet address
    },
    {
      id: 2,
      name: 'Bank Account (SWIFT)',
      fromAsset: 'USDT',
      toAsset: 'USD',
      rate: '1 USDT ≈ 1 USD',
      accountNumber: '1234567890',
      swift: 'CAIXESBBXXX',
      limits: '1,000 - 10,000 USDT / day',
      walletAddress: '0xabcd...ef12', // USDT wallet address
    },
  ],
}

// Component to display a copyable field
const CopyField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-card/30 p-2">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-card/80"
        onClick={() => navigator.clipboard.writeText(value)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Component to display asset pair and rate information
const AssetPairInfo = ({ fromAsset, toAsset }: BaseRamp) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-card/50 px-3 py-2 text-primary-foreground">
      <span className="font-medium">{fromAsset}</span>
      <ArrowUpRight className="h-4 w-4 text-primary" />
      <span className="font-medium">{toAsset}</span>
      {/* <span className="text-sm text-muted-foreground">({rate})</span> */}
    </div>
  )
}

// Component to display the ramps screen
export const RampsScreen = () => {
  return (
    <div className="space-y-6 py-6">
      {/* Onramps Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <ArrowDownRight className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-foreground">Onramps</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* SEPA Transfer Card */}
          <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-medium text-foreground">{ramps.onramps[0].name}</h4>
              <AssetPairInfo {...ramps.onramps[0]} />
            </div>
            <div className="space-y-2">
              {ramps.onramps[0].iban && <CopyField label="IBAN" value={ramps.onramps[0].iban} />}
              {ramps.onramps[0].reference && (
                <CopyField label="Reference" value={ramps.onramps[0].reference} />
              )}
            </div>
          </div>

          {/* Credit Card Transfer Card */}
          <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-medium text-foreground">{ramps.onramps[1].name}</h4>
              <AssetPairInfo {...ramps.onramps[1]} />
            </div>
            {ramps.onramps[1].provider && (
              <div className="rounded-lg bg-card/30 p-3">
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-medium text-foreground">{ramps.onramps[1].provider}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offramps Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">Offramps</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* SEPA Offramp Card */}
          <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-medium text-foreground">{ramps.offramps[0].name}</h4>
              <AssetPairInfo {...ramps.offramps[0]} />
            </div>
            <div className="space-y-2">
              <CopyField label="Send funds to wallet" value={ramps.offramps[0].walletAddress} />
              {ramps.offramps[0].iban && <CopyField label="IBAN" value={ramps.offramps[0].iban} />}
              {ramps.offramps[0].holder && (
                <CopyField label="Account Holder" value={ramps.offramps[0].holder} />
              )}
            </div>
          </div>

          {/* SWIFT Offramp Card */}
          <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-medium text-foreground">{ramps.offramps[1].name}</h4>
              <AssetPairInfo {...ramps.offramps[1]} />
            </div>
            <div className="space-y-2">
              <CopyField label="Send funds to wallet" value={ramps.offramps[1].walletAddress} />
              {ramps.offramps[1].accountNumber && (
                <CopyField label="Account Number" value={ramps.offramps[1].accountNumber} />
              )}
              {ramps.offramps[1].swift && (
                <CopyField label="SWIFT/BIC" value={ramps.offramps[1].swift} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
