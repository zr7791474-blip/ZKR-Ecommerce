'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, orders: 24 },
  { name: 'Feb', revenue: 3000, orders: 13 },
  { name: 'Mar', revenue: 2000, orders: 18 },
  { name: 'Apr', revenue: 2780, orders: 39 },
  { name: 'May', revenue: 1890, orders: 48 },
  { name: 'Jun', revenue: 2390, orders: 38 },
  { name: 'Jul', revenue: 3490, orders: 43 },
  { name: 'Aug', revenue: 4000, orders: 52 },
  { name: 'Sep', revenue: 4500, orders: 61 },
  { name: 'Oct', revenue: 5200, orders: 72 },
  { name: 'Nov', revenue: 6100, orders: 85 },
  { name: 'Dec', revenue: 7200, orders: 98 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}