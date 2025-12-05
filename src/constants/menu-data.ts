import type { MegaMenuCategory } from '@/types/glossier'

export const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  Categories: {
    columns: [
      {
        title: 'Shop by Category',
        items: [
          { label: 'Skincare', link: '/products?category=skincare' },
          { label: 'Makeup', link: '/products?category=makeup' },
          { label: 'Hair Care', link: '/products?category=hair' },
          { label: 'Body & Bath', link: '/products?category=body' },
          { label: 'Fragrance', link: '/products?category=fragrance' },
          { label: 'Tools & Devices', link: '/products?category=tools' },
          { label: 'Wellness', link: '/products?category=wellness' },
        ],
      },
      {
        title: 'Trending Now',
        items: [
          { label: 'K-Beauty Bestsellers', link: '#' },
          { label: 'Holiday Gift Sets', link: '#' },
          { label: 'Clean Beauty', link: '#' },
          { label: 'Vegan Products', link: '#' },
          { label: 'Travel Size', link: '#' },
          { label: 'Limited Edition', link: '#' },
        ],
      },
      {
        title: 'Shop by Brand',
        items: [
          { label: 'Beauty of Joseon', link: '#' },
          { label: 'COSRX', link: '#' },
          { label: 'Laneige', link: '#' },
          { label: 'Innisfree', link: '#' },
          { label: 'View All Brands', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2898419-main-zoom.webp',
      title: 'WINTER SALE',
      subtitle: 'UP TO 70% OFF',
      linkText: 'Shop Now',
      isSale: true,
    },
  },
  Skincare: {
    columns: [
      {
        title: 'By Category',
        items: [
          { label: 'Shop All Skincare', link: '/products?category=skincare' },
          { label: 'Cleansers & Toners', link: '#' },
          { label: 'Essences & Serums', link: '#' },
          { label: 'Moisturizers & Creams', link: '#' },
          { label: 'Eye Care', link: '#' },
          { label: 'Face Masks', link: '#' },
          { label: 'Sunscreen', link: '#' },
          { label: 'Exfoliators & Peels', link: '#' },
        ],
      },
      {
        title: 'By Concern',
        items: [
          { label: 'Anti-Aging', link: '#' },
          { label: 'Acne & Blemishes', link: '#' },
          { label: 'Brightening', link: '#' },
          { label: 'Hydration', link: '#' },
          { label: 'Pore Care', link: '#' },
          { label: 'Sensitive Skin', link: '#' },
        ],
      },
      {
        title: 'Bestsellers',
        items: [
          { label: 'COSRX Snail Mucin', link: '#' },
          { label: 'Beauty of Joseon Relief Sun', link: '#' },
          { label: 'Laneige Water Sleeping Mask', link: '#' },
          { label: 'Innisfree Green Tea Serum', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2895845-main-zoom.webp',
      title: 'New Arrivals',
      subtitle: 'K-Beauty Essentials',
      linkText: 'Discover Now',
    },
  },
  Makeup: {
    columns: [
      {
        title: 'Face',
        items: [
          { label: 'Shop All Face', link: '#' },
          { label: 'Foundation & BB Cream', link: '#' },
          { label: 'Concealer', link: '#' },
          { label: 'Cushion Compacts', link: '#' },
          { label: 'Blush & Bronzer', link: '#' },
          { label: 'Highlighter', link: '#' },
          { label: 'Setting Powder & Spray', link: '#' },
        ],
      },
      {
        title: 'Eyes',
        items: [
          { label: 'Shop All Eyes', link: '#' },
          { label: 'Eyeshadow Palettes', link: '#' },
          { label: 'Eyeliner', link: '#' },
          { label: 'Mascara', link: '#' },
          { label: 'Eyebrow Products', link: '#' },
        ],
      },
      {
        title: 'Lips',
        items: [
          { label: 'Shop All Lips', link: '#' },
          { label: 'Lipstick', link: '#' },
          { label: 'Lip Tint', link: '#' },
          { label: 'Lip Gloss', link: '#' },
          { label: 'Lip Balm', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2862480-main-zoom.webp',
      title: 'Holiday Makeup',
      subtitle: 'Festive Looks',
      linkText: 'Shop Collection',
    },
  },
  Balms: {
    columns: [
      {
        title: 'Lip Balms',
        items: [
          { label: 'Shop All Balms', link: '#' },
          { label: 'Tinted Lip Balm', link: '#' },
          { label: 'Overnight Lip Mask', link: '#' },
          { label: 'SPF Lip Balm', link: '#' },
          { label: 'Lip Sleeping Pack', link: '#' },
        ],
      },
      {
        title: 'By Flavor',
        items: [
          { label: 'Original', link: '#' },
          { label: 'Berry', link: '#' },
          { label: 'Mint', link: '#' },
          { label: 'Coconut', link: '#' },
          { label: 'Rose', link: '#' },
        ],
      },
      {
        title: 'Sets & Bundles',
        items: [
          { label: 'Balm Trio Set', link: '#' },
          { label: 'Travel Size Set', link: '#' },
          { label: 'Gift Sets', link: '#' },
        ],
      },
    ],
  },
  Body: {
    columns: [
      {
        title: 'Body Care',
        items: [
          { label: 'Shop All Body', link: '#' },
          { label: 'Body Wash & Soap', link: '#' },
          { label: 'Body Lotion & Cream', link: '#' },
          { label: 'Body Oil', link: '#' },
          { label: 'Hand Cream', link: '#' },
          { label: 'Foot Care', link: '#' },
        ],
      },
      {
        title: 'Bath',
        items: [
          { label: 'Bath Bombs', link: '#' },
          { label: 'Bath Salts', link: '#' },
          { label: 'Shower Gel', link: '#' },
          { label: 'Body Scrubs', link: '#' },
        ],
      },
      {
        title: 'Featured',
        items: [
          { label: 'Body Hero Collection', link: '#' },
          { label: 'Glow Body Oil', link: '#' },
          { label: 'Shea Butter Cream', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2895985-main-zoom.webp',
      title: 'Body Care',
      subtitle: 'Hydrate & Glow',
      linkText: 'Shop Now',
    },
  },
  Fragrance: {
    columns: [
      {
        title: 'By Type',
        items: [
          { label: 'Shop All Fragrance', link: '#' },
          { label: 'Eau de Parfum', link: '#' },
          { label: 'Eau de Toilette', link: '#' },
          { label: 'Body Mist', link: '#' },
          { label: 'Solid Perfume', link: '#' },
          { label: 'Rollerball', link: '#' },
        ],
      },
      {
        title: 'By Scent',
        items: [
          { label: 'Floral', link: '#' },
          { label: 'Citrus', link: '#' },
          { label: 'Woody', link: '#' },
          { label: 'Fresh', link: '#' },
          { label: 'Sweet', link: '#' },
        ],
      },
      {
        title: 'Home Fragrance',
        items: [
          { label: 'Candles', link: '#' },
          { label: 'Diffusers', link: '#' },
          { label: 'Room Spray', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2923134-main-zoom.webp',
      title: 'Signature Scents',
      subtitle: 'Find Your Fragrance',
      linkText: 'Explore',
    },
  },
  'Glossier Goods': {
    columns: [
      {
        title: 'Apparel',
        items: [
          { label: 'Shop All Apparel', link: '#' },
          { label: 'Hoodies & Sweatshirts', link: '#' },
          { label: 'T-Shirts', link: '#' },
          { label: 'Caps & Hats', link: '#' },
        ],
      },
      {
        title: 'Accessories',
        items: [
          { label: 'Tote Bags', link: '#' },
          { label: 'Pouches', link: '#' },
          { label: 'Water Bottles', link: '#' },
          { label: 'Stickers & Pins', link: '#' },
        ],
      },
      {
        title: 'Lifestyle',
        items: [
          { label: 'Journals', link: '#' },
          { label: 'Towels', link: '#' },
          { label: 'Phone Cases', link: '#' },
        ],
      },
    ],
  },
  Sets: {
    columns: [
      {
        title: 'Gift Sets',
        items: [
          { label: 'Shop All Sets', link: '#' },
          { label: 'Skincare Sets', link: '#' },
          { label: 'Makeup Sets', link: '#' },
          { label: 'Holiday Bundles', link: '#' },
          { label: 'Travel Kits', link: '#' },
        ],
      },
      {
        title: 'By Price',
        items: [
          { label: 'Under $50', link: '#' },
          { label: '$50 - $100', link: '#' },
          { label: '$100 - $200', link: '#' },
          { label: 'Luxury Sets $200+', link: '#' },
        ],
      },
      {
        title: 'Save More',
        items: [
          { label: 'Build Your Own Set', link: '#' },
          { label: 'Duo Savings', link: '#' },
          { label: 'Value Sets', link: '#' },
        ],
      },
    ],
    ad: {
      image: '/cosmetics/s2542843-main-zoom.webp',
      title: 'Holiday Gifts',
      subtitle: 'Perfect Presents',
      linkText: 'Shop Gifts',
    },
  },
  'Shop All': {
    columns: [
      {
        title: 'New Arrivals',
        items: [
          { label: 'This Week', link: '#' },
          { label: 'This Month', link: '#' },
          { label: 'Coming Soon', link: '#' },
        ],
      },
      {
        title: 'Bestsellers',
        items: [
          { label: 'Top Rated', link: '#' },
          { label: 'Most Loved', link: '#' },
          { label: 'Customer Favorites', link: '#' },
        ],
      },
      {
        title: 'Special Offers',
        items: [
          { label: 'Sale Items', link: '#' },
          { label: 'Bundle & Save', link: '#' },
          { label: 'Clearance', link: '#' },
        ],
      },
    ],
  },
}

export const TRENDING_SEARCHES = [
  'anua heartleaf toner',
  'banila co cleansing balm',
  'anastasia beverly hills brow',
  'benefit mascara',
  'retinol eye cream',
  'hyaluronic acid serum',
  'cleansing oil',
  'moisturizing cream',
  'setting powder',
  'k-beauty essentials',
]
