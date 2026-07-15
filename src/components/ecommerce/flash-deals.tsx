'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { ProductCard } from '@/components/ecommerce/product-card';

function getEndOfDay() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

function useCountdown() {
  const [target] = useState(getEndOfDay);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export function FlashDeals({ products }: { products: any[] }) {
  const { h, m, s } = useCountdown();

  if (products.length === 0) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Flash Deals</h2>
              <p className="text-muted-foreground mt-0.5">Today only — while supplies last</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: 'H', value: h },
              { label: 'M', value: m },
              { label: 'S', value: s },
            ].map((unit, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] px-3 py-2 text-center min-w-[52px]">
                  <span className="text-lg font-bold text-foreground tabular-nums">{pad(unit.value)}</span>
                  <span className="block text-[10px] text-muted-foreground uppercase">{unit.label}</span>
                </div>
                {i < 2 && <span className="text-foreground/30 font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
