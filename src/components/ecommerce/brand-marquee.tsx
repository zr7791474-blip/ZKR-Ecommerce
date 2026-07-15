'use client';

const brands = ['Apple', 'Sony', 'Nike', 'Ray-Ban', 'ZKR Audio', 'ZKR Tech', 'ZKR Fit', 'ZKR Beauty'];

export function BrandMarquee() {
  const track = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden py-8 border-y border-foreground/[0.06]">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex w-max animate-marquee">
        {track.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-8 text-xl md:text-2xl font-semibold tracking-tight text-muted-foreground/50 whitespace-nowrap select-none"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
