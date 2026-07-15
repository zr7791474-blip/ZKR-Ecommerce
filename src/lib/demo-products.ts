/**
 * Shared demo product catalog — generated from the static images in
 * public/products/. This exists so the Hero showcase can always rotate
 * through every available product image even when the database doesn't
 * (yet) have a real product using that image.
 *
 * Shape matches the `Product` type expected by <ProductCard /> and the
 * Hero showcase, so this single array can be reused anywhere a product
 * list is needed instead of hardcoding new arrays per page.
 */

export type DemoProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: Array<{ url: string }>;
  category: { name: string; slug: string };
  brand: string;
  sku: string;
  description: string;
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
  averageRating: number;
  _count: { ratings: number };
};

type DemoOpts = {
  isFeatured?: boolean;
  isNew?: boolean;
  stock?: number;
  averageRating?: number;
  ratingsCount?: number;
};

function demo(
  id: string,
  name: string,
  file: string,
  category: string,
  categorySlug: string,
  brand: string,
  price: number,
  compareAtPrice: number | null,
  description: string,
  opts: DemoOpts = {}
): DemoProduct {
  return {
    id: `demo-${id}`,
    name,
    slug: `demo-${id}`,
    price,
    compareAtPrice,
    images: [{ url: `/products/${file}` }],
    category: { name: category, slug: categorySlug },
    brand,
    sku: `ZKR-${id.toUpperCase()}`,
    description,
    isFeatured: opts.isFeatured ?? false,
    isNew: opts.isNew ?? false,
    stock: opts.stock ?? 24,
    averageRating: opts.averageRating ?? 4.5,
    _count: { ratings: opts.ratingsCount ?? 128 },
  };
}

export const demoProducts: DemoProduct[] = [
  demo('airpods', 'Wireless Earbuds Pro', 'airpods.jpg', 'Audio', 'audio', 'ZKR Audio', 179, 219, 'Active noise cancellation with spatial audio and all-day battery life.', { isFeatured: true, averageRating: 4.8, ratingsCount: 342 }),
  demo('backpack', 'Everyday Commuter Backpack', 'Backpack.jpg', 'Bags', 'bags', 'ZKR Carry', 89, 120, 'Weatherproof, padded laptop compartment, built for daily commutes.', { isNew: true, ratingsCount: 76 }),
  demo('office-chair-bw', 'Ergonomic Office Chair', 'Black and White Office Chair.jpg', 'Furniture', 'furniture', 'ZKR Home', 349, 429, 'Lumbar support, breathable mesh back, fully adjustable armrests.', { isFeatured: true, ratingsCount: 154 }),
  demo('ps4-controller', 'Wireless Game Controller', 'Black Sony PS4 Game Controller.jpg', 'Gaming', 'gaming', 'ZKR Play', 59, 69, 'Precision analog sticks with responsive haptic feedback.', { ratingsCount: 203 }),
  demo('bt-speaker', 'Portable Bluetooth Speaker', 'Bluetooth Speaker.jpg', 'Audio', 'audio', 'ZKR Audio', 79, 99, '360° sound, waterproof design, 20-hour battery.', { isNew: true, ratingsCount: 98 }),
  demo('coffee-mug', 'Ceramic Coffee Mug', 'Coffee Mug.jpg', 'Home', 'home', 'ZKR Home', 18, 24, 'Double-walled ceramic mug that keeps drinks hot for longer.', { ratingsCount: 44 }),
  demo('denim-jacket', 'Classic Denim Jacket', 'Denim Jacket.jpg', 'Fashion', 'fashion', 'ZKR Apparel', 95, 130, 'Timeless denim jacket with a relaxed, everyday fit.', { averageRating: 4.6, ratingsCount: 112 }),
  demo('desk-lamp', 'Adjustable LED Desk Lamp', 'Desk Lamp.jpg', 'Home', 'home', 'ZKR Home', 45, 60, 'Stepless dimming with adjustable color temperature.', { ratingsCount: 67 }),
  demo('dumbbells', 'Adjustable Dumbbell Set', 'Dumbbells.jpg', 'Sports', 'sports', 'ZKR Fit', 129, 159, 'Space-saving adjustable dumbbells for home workouts.', { isFeatured: true, ratingsCount: 88 }),
  demo('face-cream', 'Hydrating Face Cream', 'Face Cream.jpg', 'Beauty', 'beauty', 'ZKR Beauty', 34, 42, 'Lightweight daily moisturizer with SPF protection.', { ratingsCount: 59 }),
  demo('handbag', 'Leather Tote Handbag', 'Handbag.jpg', 'Bags', 'bags', 'ZKR Carry', 149, 199, 'Genuine leather tote with an interior zip pocket.', { isFeatured: true, averageRating: 4.7, ratingsCount: 137 }),
  demo('hoodie', 'Essential Pullover Hoodie', 'Hoodie.jpg', 'Fashion', 'fashion', 'ZKR Apparel', 65, 85, 'Brushed fleece hoodie for everyday comfort.', { isNew: true, ratingsCount: 94 }),
  demo('house-plant', 'Potted House Plant', 'House Plant.jpg', 'Home', 'home', 'ZKR Home', 29, null, 'Low-maintenance houseplant in a ceramic planter.', { ratingsCount: 31 }),
  demo('iphone15', 'iPhone 15', 'iphone15.jpg', 'Electronics', 'electronics', 'Apple', 799, 899, 'The latest iPhone with an advanced camera system and A16 chip.', { isFeatured: true, isNew: true, averageRating: 4.9, ratingsCount: 512 }),
  demo('macbook', 'MacBook Pro', 'macbook.jpg', 'Electronics', 'electronics', 'Apple', 1599, 1799, 'Blazing-fast performance for professional workflows.', { isFeatured: true, averageRating: 4.9, ratingsCount: 401 }),
  demo('mech-keyboard', 'Mechanical Keyboard', 'Mechanical Keyboard.jpg', 'Electronics', 'electronics', 'ZKR Tech', 119, 149, 'Hot-swappable mechanical switches with per-key RGB.', { isNew: true, ratingsCount: 176 }),
  demo('nike-airmax', 'Nike Air Max', 'nike-airmax.jpg', 'Footwear', 'footwear', 'Nike', 139, 169, 'Iconic cushioning with a bold, streetwear-ready look.', { isFeatured: true, averageRating: 4.7, ratingsCount: 289 }),
  demo('office-chair', 'Executive Office Chair', 'Office Chair.jpg', 'Furniture', 'furniture', 'ZKR Home', 399, 479, 'Premium executive chair with reclining backrest.', { ratingsCount: 62 }),
  demo('perfume', 'Signature Perfume', 'Perfume Bottle.jpg', 'Beauty', 'beauty', 'ZKR Beauty', 68, 85, 'A refined, long-lasting fragrance for everyday wear.', { ratingsCount: 53 }),
  demo('running-shoes', 'Performance Running Shoes', 'Running Shoes.jpg', 'Footwear', 'footwear', 'ZKR Fit', 99, 129, 'Lightweight support built for long-distance running.', { isNew: true, ratingsCount: 148 }),
  demo('sunglasses', 'Classic Wayfarer Sunglasses', 'Shallow Focus Photo of Black Ray-Ban Wayfarer Sunglasses.jpg', 'Accessories', 'accessories', 'Ray-Ban', 159, 189, 'Timeless wayfarer design with UV-protective lenses.', { isFeatured: true, averageRating: 4.8, ratingsCount: 221 }),
  demo('shampoo', 'Nourishing Shampoo', 'Shampoo Bottle.jpg', 'Beauty', 'beauty', 'ZKR Beauty', 22, 28, 'Sulfate-free formula for daily use on all hair types.', { ratingsCount: 39 }),
  demo('smartwatch', 'Fitness Smartwatch', 'Smartwatch.jpg', 'Electronics', 'electronics', 'ZKR Tech', 199, 249, 'Track workouts, sleep, and heart rate around the clock.', { isFeatured: true, isNew: true, averageRating: 4.6, ratingsCount: 267 }),
  demo('sony-wh1000xm5', 'Sony WH-1000XM5 Headphones', 'sony-wh1000xm5.jpg', 'Audio', 'audio', 'Sony', 349, 399, 'Industry-leading noise cancellation with premium sound.', { isFeatured: true, averageRating: 4.9, ratingsCount: 378 }),
  demo('tshirt', 'Essential Cotton T-Shirt', 'T-Shirt.JPG', 'Fashion', 'fashion', 'ZKR Apparel', 25, 32, 'Soft, breathable cotton tee in a relaxed fit.', { ratingsCount: 84 }),
  demo('game-controller', 'Universal Game Controller', 'Video Game Controller.jpg', 'Gaming', 'gaming', 'ZKR Play', 49, 59, 'Cross-platform compatibility with customizable buttons.', { ratingsCount: 71 }),
  demo('wallet', 'Slim Leather Wallet', 'Wallet.jpg', 'Bags', 'bags', 'ZKR Carry', 45, 55, 'RFID-blocking slim wallet in genuine leather.', { ratingsCount: 47 }),
  demo('water-bottle', 'Insulated Water Bottle', 'Water Bottle.jpg', 'Sports', 'sports', 'ZKR Fit', 32, 40, 'Keeps drinks cold for 24 hours or hot for 12.', { isNew: true, ratingsCount: 58 }),
  demo('cordless-headphones', 'Cordless Headphones', 'White and Orange Cordless Headphones.jpg', 'Audio', 'audio', 'ZKR Audio', 89, 109, 'Comfortable over-ear design with rich, balanced sound.', { ratingsCount: 65 }),
  demo('wireless-mouse', 'Wireless Ergonomic Mouse', 'Wireless Mouse.jpg', 'Electronics', 'electronics', 'ZKR Tech', 39, 49, 'Silent clicks with a precision optical sensor.', { ratingsCount: 92 }),
  demo('wrist-watch', 'Classic Wrist Watch', 'Wrist Watch.jpg', 'Accessories', 'accessories', 'ZKR Time', 219, 259, 'Stainless steel case with a genuine leather strap.', { isFeatured: true, averageRating: 4.7, ratingsCount: 133 }),
  demo('yoga-mat', 'Non-Slip Yoga Mat', 'Yoga Mat.jpg', 'Sports', 'sports', 'ZKR Fit', 35, 45, 'Extra-cushioned, non-slip mat for yoga and stretching.', { ratingsCount: 51 }),
];

export function getDemoProducts() {
  return demoProducts;
}

/**
 * Picks demo products for use as recommendations/fallbacks (related products,
 * cart suggestions, checkout recommendations, etc.) so every page that needs
 * "a few more products to show" pulls from this same catalog instead of a
 * new hardcoded array.
 */
export function pickDemoProducts(
  count: number,
  opts: { categorySlug?: string; excludeIds?: string[] } = {}
) {
  const { categorySlug, excludeIds = [] } = opts;

  let pool = demoProducts.filter((p) => !excludeIds.includes(p.id));

  if (categorySlug) {
    const inCategory = pool.filter((p) => p.category.slug === categorySlug);
    if (inCategory.length >= count) pool = inCategory;
  }

  return pool.slice(0, count);
}
