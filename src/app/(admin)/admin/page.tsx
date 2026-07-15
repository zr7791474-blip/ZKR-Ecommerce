import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { SalesChart, type SalesChartPoint } from '@/components/admin/sales-chart';
import { TopProducts, type TopProductRow } from '@/components/admin/top-products';
import { RecentOrders } from '@/components/admin/recent-orders';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Dashboard — Admin — ZKR E-Commerce',
};

function pctChange(current: number, previous: number): { value: string; trend: 'up' | 'down' } {
  if (previous === 0) {
    return current > 0 ? { value: '+100%', trend: 'up' } : { value: '0%', trend: 'up' };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    trend: change >= 0 ? 'up' : 'down',
  };
}

export default async function AdminDashboard() {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    thisMonthRevenue,
    lastMonthRevenue,
    thisMonthOrders,
    lastMonthOrders,
    thisMonthCustomers,
    lastMonthCustomers,
    thisMonthProducts,
    lastMonthProducts,
    yearOrders,
    topProductRows,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID', createdAt: { gte: startOfThisMonth } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID', createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfThisMonth } } }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
    prisma.product.count({ where: { isActive: true, createdAt: { gte: startOfThisMonth } } }),
    prisma.product.count({ where: { isActive: true, createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
    prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: twelveMonthsAgo } },
      select: { total: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  // Bucket the last 12 months of paid orders into monthly revenue/order counts.
  const monthLabels: string[] = [];
  const monthBuckets = new Map<string, SalesChartPoint>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString(undefined, { month: 'short' });
    monthLabels.push(key);
    monthBuckets.set(key, { name: label, revenue: 0, orders: 0 });
  }

  for (const order of yearOrders as any[]) {
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthBuckets.get(key);
    if (bucket) {
      bucket.revenue += Number(order.total);
      bucket.orders += 1;
    }
  }

  const salesData = monthLabels.map((key) => monthBuckets.get(key)!);

  // Resolve product names for the top-selling products.
  const topProductIds = (topProductRows as any[]).map((r) => r.productId);
  const topProductDetails = topProductIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true },
      })
    : [];
  const productNameById = new Map(topProductDetails.map((p: any) => [p.id, p.name as string]));

  const topProducts: TopProductRow[] = (topProductRows as any[]).map((row) => ({
    id: row.productId as string,
    name: (productNameById.get(row.productId) as string) || 'Unknown product',
    sales: (row._sum.quantity as number) || 0,
    revenue: Number(row._sum.total || 0),
  }));

  const revenueTrend = pctChange(
    Number(thisMonthRevenue._sum.total || 0),
    Number(lastMonthRevenue._sum.total || 0)
  );
  const ordersTrend = pctChange(thisMonthOrders, lastMonthOrders);
  const customersTrend = pctChange(thisMonthCustomers, lastMonthCustomers);
  const productsTrend = pctChange(thisMonthProducts, lastMonthProducts);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${Number(totalRevenue._sum.total || 0).toLocaleString()}`,
      change: revenueTrend.value,
      trend: revenueTrend.trend,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: ordersTrend.value,
      trend: ordersTrend.trend,
      icon: ShoppingCart,
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: customersTrend.value,
      trend: customersTrend.trend,
      icon: Users,
    },
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      change: productsTrend.value,
      trend: productsTrend.trend,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-accent" />
                )}
                <span className={stat.trend === 'up' ? 'text-success' : 'text-accent'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Revenue and orders over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling by units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts products={topProducts} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/admin/orders">
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentOrders orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
}