import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Sample data for the chart
const data = [
  { date: 'Jan', balance: 5000 },
  { date: 'Feb', balance: 7000 },
  { date: 'Mar', balance: 6500 },
  { date: 'Apr', balance: 8000 },
  { date: 'May', balance: 9500 },
  { date: 'Jun', balance: 12000 },
]

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-card/80 p-3 backdrop-blur-xl">
        <p className="text-sm font-medium text-foreground">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

// Component to display the balance history chart
export const BalanceChart = () => {
  return (
    <div className="rounded-3xl bg-card p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Balance History</h3>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={value => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
