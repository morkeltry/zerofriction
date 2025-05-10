import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Button } from './ui/button'

// Component to display the user's balance with quick action buttons
export const BalanceCard = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-card p-6 backdrop-blur-xl">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

      {/* Balance section */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
        <h2 className="mt-1 text-4xl font-light text-foreground">$12,345.67</h2>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2 border-border/10 bg-card/50 backdrop-blur-xl hover:bg-card/80"
        >
          <ArrowUpRight className="h-4 w-4" />
          Send
        </Button>
        <Button variant="outline" className="flex-1 gap-2  backdrop-blur-xl hover:bg-card/80">
          <ArrowDownRight className="h-4 w-4" />
          Receive
        </Button>
      </div>
    </div>
  )
}
