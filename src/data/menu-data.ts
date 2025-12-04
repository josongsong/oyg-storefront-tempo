import type { MegaMenuCategory } from '@/types/glossier'

export const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  Categories: {
    columns: [
      {
        title: 'All Categories',
        items: [
          { label: 'Skincare', link: '#' },
          { label: 'Makeup', link: '#' },
          { label: 'Bath & Body', link: '#' },
          { label: 'Hair', link: '#' },
          { label: 'Face Masks', link: '#' },
          { label: 'Suncare', link: '#' },
          { label: 'K-Pop', link: '#' },
        ],
      },
      {
        title: '\u00A0',
        items: [
          { label: 'Makeup Brush & Tools', link: '#' },
          { label: 'Accessories', link: '#' },
          { label: 'Wellness', link: '#' },
          { label: "Men's Care", link: '#' },
          { label: 'Supplements', link: '#' },
          { label: 'Food & Drink', link: '#' },
          { label: 'Special Value Sets', link: '#' },
        ],
      },
      {
        title: 'Trend Keyword',
        items: [
          { label: 'Vegan', link: '#' },
          { label: 'Clean Beauty', link: '#' },
        ],
      },
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1576158187530-986d8460554d?q=80&w=600&auto=format&fit=crop',
      title: 'WINTER SALE',
      subtitle: 'UP TO 77% OFF',
      linkText: '7 DAYS ONLY',
      isSale: true,
    },
  },
  Skincare: {
    columns: [
      {
        title: 'Shop By Category',
        items: [
          { label: 'Shop All Skincare', link: '#' },
          { label: 'Cleansers', link: '#' },
          { label: 'Moisturizers', link: '#' },
          { label: 'Serums', link: '#' },
          { label: 'Masks', link: '#' },
          { label: 'Sunscreen', link: '#' },
        ],
      },
      {
        title: 'Shop By Concern',
        items: [
          { label: 'Dryness', link: '#' },
          { label: 'Acne', link: '#' },
          { label: 'Dullness', link: '#' },
          { label: 'Redness', link: '#' },
        ],
      },
      {
        title: 'Featured',
        items: [
          { label: 'Milky Jelly Cleanser', link: '#' },
          { label: 'Futuredew', link: '#' },
          { label: 'After Baulme', link: '#' },
        ],
      },
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop',
      title: 'New: K-Glow Serum',
      subtitle: 'Glass skin in a bottle.',
      linkText: 'Shop the drop',
    },
  },
  Makeup: {
    columns: [
      {
        title: 'Face',
        items: [
          { label: 'Shop All Face', link: '#' },
          { label: 'Foundation', link: '#' },
          { label: 'Concealer', link: '#' },
          { label: 'Blush', link: '#' },
          { label: 'Highlighter', link: '#' },
        ],
      },
      {
        title: 'Eyes',
        items: [
          { label: 'Shop All Eyes', link: '#' },
          { label: 'Mascara', link: '#' },
          { label: 'Brows', link: '#' },
          { label: 'Eyeshadow', link: '#' },
        ],
      },
      {
        title: 'Lips',
        items: [
          { label: 'Shop All Lips', link: '#' },
          { label: 'Lipstick', link: '#' },
          { label: 'Lip Gloss', link: '#' },
          { label: 'Lip Liner', link: '#' },
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
          { label: 'Body Wash', link: '#' },
          { label: 'Body Lotion', link: '#' },
          { label: 'Hand Cream', link: '#' },
        ],
      },
      {
        title: 'Collections',
        items: [
          { label: 'Body Hero', link: '#' },
          { label: 'You Look Good', link: '#' },
        ],
      },
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600&auto=format&fit=crop',
      title: 'Body Hero',
      subtitle: 'Glow from head to toe.',
      linkText: 'Shop Body Care',
    },
  },
  Fragrance: {
    columns: [
      {
        title: 'Scents',
        items: [
          { label: 'Shop All Fragrance', link: '#' },
          { label: 'Glossier You', link: '#' },
          { label: 'Candles', link: '#' },
        ],
      },
      {
        title: 'Formats',
        items: [
          { label: 'Eau de Parfum', link: '#' },
          { label: 'Solid Perfume', link: '#' },
          { label: 'Rollerball', link: '#' },
        ],
      },
    ],
  },
  'Glossier Goods': {
    columns: [
      {
        title: 'Apparel',
        items: [
          { label: 'Hoodies', link: '#' },
          { label: 'T-Shirts', link: '#' },
          { label: 'Caps', link: '#' },
        ],
      },
      {
        title: 'Accessories',
        items: [
          { label: 'Bags', link: '#' },
          { label: 'Water Bottles', link: '#' },
          { label: 'Stickers', link: '#' },
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
          { label: 'Makeup Sets', link: '#' },
          { label: 'Skincare Sets', link: '#' },
        ],
      },
      {
        title: 'Save',
        items: [
          { label: 'Build Your Own Set', link: '#' },
          { label: 'Duo Savings', link: '#' },
        ],
      },
    ],
  },
}

export const TRENDING_SEARCHES = [
  'advents',
  'victoria beckham beauty',
  'sunscreen',
  'lip oil',
  'dyson airwrap',
  'body shimmer',
  'vanilla',
  'minis',
  'gift sets',
  'trending now',
]

