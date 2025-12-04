import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, Star, ChevronLeft, ChevronRight, User, X, Heart, Plus, ChevronDown, Minus, Pause, Sparkles, Loader2, Play, Facebook, Instagram, Youtube, Twitter, Linkedin, Globe } from 'lucide-react';

// --- Type Definitions ---

interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  labelColor: string;
  tubeColor: string;
  capColor: string;
}

interface MenuItem {
  label: string;
  link: string;
  isNew?: boolean;
}

interface MenuColumn {
  title: string;
  items: MenuItem[];
}

interface MenuAd {
  image: string;
  title: string;
  subtitle: string;
  linkText: string;
  isSale?: boolean;
}

interface MegaMenuCategory {
  columns: MenuColumn[];
  ad?: MenuAd;
}

interface FilterOption {
  label: string;
  count: number;
}

interface Filter {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  isOpen: boolean;
  hasSearch?: boolean;
  options: FilterOption[];
}

interface Product {
  id: number | string;
  brand: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  badge?: string;
  valueText?: string;
  image: string;
}

// --- Mock Data ---

const FLAVORS: Flavor[] = [
  { id: 'original', name: 'Original', description: 'Fragrance-free, untinted.', color: '#F5F5F5', labelColor: '#000', tubeColor: '#FFFFFF', capColor: '#FFB6C1' },
  { id: 'rose', name: 'Rose', description: 'Fizzy rose with a shimmery baby pink tint.', color: '#FBCFE8', labelColor: '#000', tubeColor: '#FBCFE8', capColor: '#F472B6' },
  { id: 'birthday', name: 'Birthday', description: 'Vanilla buttercream cake with subtle shimmer.', color: '#E5E7EB', labelColor: '#000', tubeColor: '#E5E5E5', capColor: '#FCD34D' },
  { id: 'strawberry', name: 'Strawberry', description: 'Sweet strawberry with a jammy red tint.', color: '#EF4444', labelColor: '#FFF', tubeColor: '#EF4444', capColor: '#FECACA' },
  { id: 'mint', name: 'Mint', description: 'Cooling menthol with a clear finish.', color: '#A7F3D0', labelColor: '#000', tubeColor: '#A7F3D0', capColor: '#34D399' },
  { id: 'coconut', name: 'Coconut', description: 'Beach vacation with a clear finish.', color: '#FDE68A', labelColor: '#000', tubeColor: '#FDE68A', capColor: '#D97706' },
  { id: 'lavender', name: 'Lavender', description: 'Bright floral with a sheer purple tint.', color: '#C4B5FD', labelColor: '#000', tubeColor: '#C4B5FD', capColor: '#7C3AED' },
  { id: 'mango', name: 'Mango', description: 'Fresh and juicy with a translucent coral tint.', color: '#FB923C', labelColor: '#000', tubeColor: '#FB923C', capColor: '#F87171' },
  { id: 'wildfig', name: 'Wild Fig', description: 'Jammy fruit with a deep coral tint.', color: '#9F1239', labelColor: '#FFF', tubeColor: '#9F1239', capColor: '#BE123C' },
];

const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  'Categories': {
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
        ]
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
        ]
      },
      {
        title: 'Trend Keyword',
        items: [
          { label: 'Vegan', link: '#' },
          { label: 'Clean Beauty', link: '#' },
        ]
      }
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1576158187530-986d8460554d?q=80&w=600&auto=format&fit=crop',
      title: 'WINTER SALE',
      subtitle: 'UP TO 77% OFF',
      linkText: '7 DAYS ONLY',
      isSale: true
    }
  },
  'Skincare': {
    columns: [
      { title: 'Shop By Category', items: [{ label: 'Shop All Skincare', link: '#' }, { label: 'Cleansers', link: '#' }, { label: 'Moisturizers', link: '#' }, { label: 'Serums', link: '#' }, { label: 'Masks', link: '#' }, { label: 'Sunscreen', link: '#' }] },
      { title: 'Shop By Concern', items: [{ label: 'Dryness', link: '#' }, { label: 'Acne', link: '#' }, { label: 'Dullness', link: '#' }, { label: 'Redness', link: '#' }] },
      { title: 'Featured', items: [{ label: 'Milky Jelly Cleanser', link: '#' }, { label: 'Futuredew', link: '#' }, { label: 'After Baulme', link: '#' }] }
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop',
      title: 'New: K-Glow Serum',
      subtitle: 'Glass skin in a bottle.',
      linkText: 'Shop the drop'
    }
  },
  'Makeup': {
    columns: [
      { title: 'Face', items: [{ label: 'Shop All Face', link: '#' }, { label: 'Foundation', link: '#' }, { label: 'Concealer', link: '#' }, { label: 'Blush', link: '#' }, { label: 'Highlighter', link: '#' }] },
      { title: 'Eyes', items: [{ label: 'Shop All Eyes', link: '#' }, { label: 'Mascara', link: '#' }, { label: 'Brows', link: '#' }, { label: 'Eyeshadow', link: '#' }] },
      { title: 'Lips', items: [{ label: 'Shop All Lips', link: '#' }, { label: 'Lipstick', link: '#' }, { label: 'Lip Gloss', link: '#' }, { label: 'Lip Liner', link: '#' }] }
    ],
  },
  'Body': {
    columns: [
      { title: 'Body Care', items: [{ label: 'Shop All Body', link: '#' }, { label: 'Body Wash', link: '#' }, { label: 'Body Lotion', link: '#' }, { label: 'Hand Cream', link: '#' }] },
      { title: 'Collections', items: [{ label: 'Body Hero', link: '#' }, { label: 'You Look Good', link: '#' }] }
    ],
    ad: {
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600&auto=format&fit=crop',
      title: 'Body Hero',
      subtitle: 'Glow from head to toe.',
      linkText: 'Shop Body Care'
    }
  },
  'Fragrance': {
    columns: [
      { title: 'Scents', items: [{ label: 'Shop All Fragrance', link: '#' }, { label: 'Glossier You', link: '#' }, { label: 'Candles', link: '#' }] },
      { title: 'Formats', items: [{ label: 'Eau de Parfum', link: '#' }, { label: 'Solid Perfume', link: '#' }, { label: 'Rollerball', link: '#' }] }
    ]
  },
  'Glossier Goods': {
    columns: [
      { title: 'Apparel', items: [{ label: 'Hoodies', link: '#' }, { label: 'T-Shirts', link: '#' }, { label: 'Caps', link: '#' }] },
      { title: 'Accessories', items: [{ label: 'Bags', link: '#' }, { label: 'Water Bottles', link: '#' }, { label: 'Stickers', link: '#' }] }
    ],
  },
  'Sets': {
    columns: [
      { title: 'Gift Sets', items: [{ label: 'Shop All Sets', link: '#' }, { label: 'Makeup Sets', link: '#' }, { label: 'Skincare Sets', link: '#' }] },
      { title: 'Save', items: [{ label: 'Build Your Own Set', link: '#' }, { label: 'Duo Savings', link: '#' }] }
    ]
  },
};

const FILTER_DATA: Filter[] = [
  {
    id: 'price',
    title: 'Price',
    type: 'radio',
    isOpen: false,
    options: [
      { label: '$0 - $25', count: 7 },
      { label: '$25 - $50', count: 7 },
      { label: '$50 - $75', count: 3 },
      { label: '$75 - $100', count: 3 },
      { label: '$125 - $150', count: 1 },
      { label: '$150 - $175', count: 2 },
      { label: '$350 - $500', count: 1 },
      { label: '$500+', count: 1 },
    ]
  },
  {
    id: 'category',
    title: 'By category',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Moisturizers', count: 8 },
      { label: 'Cleansers', count: 4 },
      { label: 'Serums', count: 6 },
      { label: 'Sunscreens', count: 3 },
      { label: 'Masks', count: 2 },
    ]
  },
  {
    id: 'brand',
    title: 'Brand',
    type: 'checkbox',
    hasSearch: true,
    isOpen: false,
    options: [
      { label: 'Glossier', count: 15 },
      { label: 'Mecca Cosmetica', count: 4 },
      { label: 'Laneige', count: 2 },
      { label: 'Dr. Jart+', count: 1 },
    ]
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    brand: 'GLOSSIER',
    name: 'Invisible Shield Daily Sunscreen',
    price: '$35.00',
    rating: 4.8,
    reviews: 1240,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    brand: 'GLOSSIER',
    name: 'Super Pure Niacinamide + Zinc Serum',
    price: '$45.00',
    rating: 4.6,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    brand: 'GLOSSIER',
    name: 'After Baume Moisture Barrier Recovery Cream',
    price: '$28.00',
    rating: 4.9,
    reviews: 532,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    brand: 'GLOSSIER',
    name: 'The Skincare Edit Set',
    price: '$65.00',
    valueText: 'VALUED AT $88',
    rating: 4.7,
    reviews: 210,
    badge: 'VALUE SET',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    brand: 'GLOSSIER',
    name: 'Milky Jelly Cleanser',
    price: '$24.00',
    rating: 4.8,
    reviews: 4500,
    badge: 'ICON',
    image: 'https://images.unsplash.com/photo-1556228720-1987df3629e5?w=800&auto=format&fit=crop&q=80'
  },
];

const TRENDING_SEARCHES: string[] = [
  'advents', 'victoria beckham beauty', 'sunscreen', 'lip oil',
  'dyson airwrap', 'body shimmer', 'vanilla', 'minis', 'gift sets', 'trending now'
];

// --- Components ---

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-5xl bg-white border border-gray-100 border-t-0 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-h-[400px] rounded-b-lg -mt-6">
      <div className="px-6 py-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-64 shrink-0 border-r border-gray-100 pr-8">
            <h3 className="font-bold text-base mb-4 text-black">Trending right now</h3>
            <ul className="space-y-3">
              {TRENDING_SEARCHES.map((term, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-black hover:underline hover:text-gray-600 transition-colors">
                    {term}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-base mb-6 text-black">You might like these bestsellers...</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_PRODUCTS.slice(0, 4).map((product, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden mb-3 rounded-sm">
                    {product.badge && (
                      <span className="absolute top-2 left-2 z-10 text-[10px] font-medium px-2 py-1 border border-black bg-white uppercase">
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-2 right-2 z-10 p-2 hover:bg-white/80 rounded-full">
                      <Heart className="w-5 h-5 text-black stroke-1" />
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <h4 className="text-xs font-bold uppercase mb-1">{product.brand}</h4>
                  <p className="text-sm text-gray-900 leading-tight mb-1 line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{product.price}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-black" />
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 top-[180px] bg-transparent -z-10" onClick={onClose}></div>
    </div>
  );
};

interface BalmSelectorProps {
  index: number;
  selectedFlavor: Flavor;
  onSelect: (index: number, flavor: Flavor) => void;
}

const BalmSelector: React.FC<BalmSelectorProps> = ({ index, selectedFlavor, onSelect }) => {
  return (
    <div className="border-b border-gray-200 py-6 last:border-0">
      <div className="flex gap-4">
        <div className="w-16 h-20 shrink-0 bg-gray-50 flex flex-col items-center justify-center rounded-sm border border-gray-100">
          <div
            className="w-4 h-12 rounded-sm"
            style={{ backgroundColor: selectedFlavor.tubeColor }}
          />
          <div
            className="w-4 h-2 rounded-sm mt-0.5"
            style={{ backgroundColor: selectedFlavor.capColor }}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-base text-black font-normal">Balm Dotcom</h4>
          </div>
          <p className="text-sm text-black mb-3 leading-relaxed font-normal">
            <span className="text-black">{selectedFlavor.name}</span>: {selectedFlavor.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {FLAVORS.map((flavor) => (
              <button
                key={flavor.id}
                onClick={() => onSelect(index, flavor)}
                className={`w-6 h-6 rounded-sm border transition-all ${selectedFlavor.id === flavor.id
                    ? 'border-black ring-1 ring-black scale-110'
                    : 'border-gray-200 hover:border-gray-400'
                  }`}
                style={{ backgroundColor: flavor.color }}
                aria-label={`Select ${flavor.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  onNavigate: (target: 'PDP' | 'PLP', category?: string) => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLogoClick }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const NAV_LINKS = ['Skincare', 'Makeup', 'Balms', 'Body', 'Fragrance', 'Glossier Goods', 'Sets', 'Shop All'];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" onMouseLeave={() => setActiveMenu(null)}>
      <div className="bg-black text-white text-sm h-10 flex items-center justify-center relative z-50 px-4">
        <div className="flex-1 text-center flex items-center justify-center font-normal">
          <span>Get gifting today! Shop the <span className="underline cursor-pointer">2025 Glossier Gift Guide</span></span>
        </div>
        <div className="hidden md:flex items-center gap-3 absolute right-4 md:right-8">
          <ChevronLeft className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />
          <ChevronRight className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />
          <Pause className="w-4 h-4 cursor-pointer text-white/80 hover:text-white fill-current" />
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 md:py-8 flex items-center justify-between relative z-50 bg-white">
        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>

        <div className="cursor-pointer flex items-center mr-8" onClick={onLogoClick}>
          <div className="font-bold text-4xl tracking-tighter italic cursor-pointer">Glossier.</div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-auto relative">
          <div
            className="w-full bg-[#F5F5F5] rounded-sm flex items-center px-4 py-3 cursor-text hover:bg-[#EAEAEA] transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5 text-black mr-3" />
            <span className="text-sm text-gray-600 font-normal">Search 150+ global beauty brands</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-black ml-auto md:ml-8">
          <div className="hidden md:block text-sm font-normal cursor-pointer hover:text-gray-600">KR</div>
          <div className="hidden md:block text-sm font-normal cursor-pointer hover:text-gray-600">STORES</div>
          <User className="w-6 h-6 cursor-pointer hover:text-gray-600 stroke-1" />
          <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600 stroke-1" />
          <div className="relative cursor-pointer hover:text-gray-600">
            <ShoppingBag className="w-6 h-6 stroke-1" />
            <span className="absolute -top-1 -right-1 bg-[#D23F57] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">1</span>
          </div>
        </div>

        <SearchOverlay isOpen={isSearchOpen} onClose={(e) => { e.stopPropagation(); setIsSearchOpen(false); }} />
      </div>

      <div className="hidden md:flex items-center pt-1 pb-4 border-b border-gray-100 bg-white relative z-40 px-4 md:px-8">
        <nav className="flex-1 flex justify-center gap-8 text-sm font-medium tracking-wide text-black h-full items-center">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-gray-600"
            onMouseEnter={() => setActiveMenu('Categories')}
            onClick={() => setActiveMenu(activeMenu === 'Categories' ? null : 'Categories')}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Categories</span>
          </div>

          {NAV_LINKS.map((link) => (
            <div
              key={link}
              className="flex items-center relative group cursor-pointer"
              onMouseEnter={() => setActiveMenu(link)}
              onClick={() => {
                setActiveMenu(null);
                if (link === 'Sets') {
                  onNavigate('PDP');
                } else {
                  onNavigate('PLP', link);
                }
              }}
            >
              <a
                href="#"
                className={`hover:text-gray-500 transition-colors ${activeMenu === link ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
                onClick={(e) => e.preventDefault()}
              >
                {link}
              </a>
            </div>
          ))}
        </nav>
      </div>

      {activeMenu && !isSearchOpen && MEGA_MENU_DATA[activeMenu] && (
        <div
          className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-[1600px] mx-auto px-8 pt-8 pb-16">
            <div className="flex justify-between">
              <div className={`flex ${activeMenu === 'Categories' ? 'gap-16' : 'gap-16'}`}>
                {MEGA_MENU_DATA[activeMenu].columns.map((col, colIdx) => (
                  <div key={colIdx} className={`flex flex-col gap-4 min-w-[180px]`}>
                    {col.title && col.title !== '\u00A0' && (
                      <h3 className={`font-bold text-base text-black mb-2 border-b border-gray-200 pb-2 inline-block ${activeMenu === 'Categories' && colIdx === 0 ? 'w-[calc(200%+4rem)]' : 'w-full'}`}>
                        {col.title}
                      </h3>
                    )}
                    {col.title === '\u00A0' && <div className="h-[38px]"></div>}

                    <div className="flex flex-col gap-1.5">
                      {col.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.link}
                          className={`text-sm hover:underline hover:text-gray-600 font-normal ${item.isNew ? 'text-blue-600' : 'text-black'}`}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                    {colIdx === 0 && !col.title && <div className="h-4" />}
                  </div>
                ))}
              </div>

              {MEGA_MENU_DATA[activeMenu].ad && (
                <div className="w-[300px] relative group cursor-pointer overflow-hidden self-start">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                  <img
                    src={MEGA_MENU_DATA[activeMenu].ad!.image}
                    alt={MEGA_MENU_DATA[activeMenu].ad!.title}
                    className={`w-full h-[350px] object-cover transform group-hover:scale-105 transition-transform duration-500`}
                  />

                  {MEGA_MENU_DATA[activeMenu].ad!.isSale ? (
                    <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-linear-to-t from-black/80 to-transparent flex flex-col items-center text-center">
                      <h3 className="font-black text-3xl leading-tight mb-1 text-white italic drop-shadow-md">
                        {MEGA_MENU_DATA[activeMenu].ad!.title}
                      </h3>
                      <p className="text-xl font-bold text-red-500 mb-3 drop-shadow-sm bg-white/90 px-2 rounded-sm">
                        {MEGA_MENU_DATA[activeMenu].ad!.subtitle}
                      </p>
                      <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-sm">
                        {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full bg-linear-to-t from-black/60 to-transparent">
                      <h3 className="font-bold text-2xl leading-tight mb-1">{MEGA_MENU_DATA[activeMenu].ad!.title}</h3>
                      <p className="text-lg font-bold text-white mb-2">{MEGA_MENU_DATA[activeMenu].ad!.subtitle}</p>
                      <div className="flex items-center text-sm font-bold bg-[#D23F57] w-fit px-3 py-1 rounded-full">
                        {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface TubeVisualProps {
  flavor: Flavor;
  rotation: number;
}

const TubeVisual: React.FC<TubeVisualProps> = ({ flavor, rotation }) => {
  return (
    <div
      className={`relative w-16 h-48 md:w-20 md:h-64 flex flex-col items-center justify-end transition-all duration-500 ease-in-out`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className="w-full h-full rounded-t-sm relative shadow-lg overflow-hidden flex flex-col justify-end pb-8 items-center"
        style={{ backgroundColor: flavor.tubeColor }}
      >
        <div className={`absolute top-1/3 transform -rotate-90 text-3xl font-bold tracking-tighter italic opacity-90`} style={{ color: flavor.labelColor }}>
          Glossier.
        </div>
        <div className="text-center px-1 mb-2">
          <p className="text-xs font-bold leading-tight uppercase" style={{ color: flavor.labelColor }}>
            {flavor.name}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: flavor.labelColor }}>
            balm dotcom
          </p>
        </div>
      </div>
      <div
        className="w-[110%] h-12 md:h-16 rounded-sm shadow-md mt-[-2px] z-10 relative"
        style={{
          backgroundColor: flavor.capColor,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-10"></div>
      </div>
    </div>
  );
};

// --- PLP Components ---

interface FilterFacetProps {
  filter: Filter;
}

const FilterFacet: React.FC<FilterFacetProps> = ({ filter }) => {
  const [isOpen, setIsOpen] = useState(filter.isOpen);
  const isRadio = filter.type === 'radio';

  return (
    <div className="border-b border-gray-200 py-4">
      <div
        className="flex justify-between items-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-normal text-black">{filter.title}</span>
        {isOpen ? (
          <Minus className="w-3 h-3 text-black" />
        ) : (
          <Plus className="w-3 h-3 text-black" />
        )}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
          {filter.hasSearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for a brand"
                className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-0 placeholder-gray-500"
              />
              <Search className="w-3 h-3 absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
            </div>
          )}

          {filter.options.map((option, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group/item">
              <div className="relative flex items-center">
                <input
                  type={isRadio ? "radio" : "checkbox"}
                  name={isRadio ? filter.id : undefined}
                  className={`
                    peer appearance-none h-4 w-4 border border-black
                    checked:bg-transparent checked:border-black cursor-pointer
                    ${isRadio ? 'rounded-full' : 'rounded-sm'}
                  `}
                />
                {isRadio ? (
                  <div className="w-2.5 h-2.5 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                ) : (
                  <div className="w-2.5 h-2.5 bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 peer-checked:scale-100 transition-transform pointer-events-none rounded-[1px]"></div>
                )}
              </div>
              <span className="text-sm text-black font-normal">{option.label}</span>
              <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col cursor-pointer">
      <div className="relative aspect-4/5 bg-[#F9F9F9] overflow-hidden mb-3">
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`text-xs font-medium px-2 py-1 uppercase tracking-wider ${product.badge === 'VALUE SET' ? 'bg-[#D4A017] text-white' : 'bg-white border border-black text-black'
              }`}>
              {product.badge}
            </span>
          </div>
        )}
        <button className="absolute top-3 right-3 z-10 p-2 hover:bg-white/80 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-black stroke-1" />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <button className="absolute bottom-4 right-4 p-3 bg-white shadow-lg rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm font-bold tracking-wide uppercase">{product.brand}</h3>
        <p className="text-base text-black leading-snug min-h-[40px] line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-base font-medium">{product.price}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-black text-black" />
            <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
          </div>
        </div>
        {product.valueText && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{product.valueText}</p>
        )}
      </div>
    </div>
  );
};

// --- Home/Landing Components ---

const HeroSection: React.FC = () => (
  <div className="relative w-full h-[600px] md:h-[700px] bg-gray-100 overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2000&auto=format&fit=crop"
      alt="Hero"
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-black/10" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
      <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-md">Spoil Them With<br />Every Spritz</h2>
      <p className="text-lg md:text-xl font-medium mb-8 max-w-lg drop-shadow-sm">
        Treat them to an iconic fragrance and compliments will follow everywhere they go.
      </p>
      <button className="bg-black text-white px-8 py-3 text-base font-medium hover:bg-gray-800 transition-colors">
        Shop now
      </button>
    </div>
  </div>
);

const BeautyAllAroundSection: React.FC = () => (
  <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
    <h2 className="text-3xl font-normal mb-8">Beauty All Around</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: 'Give a Glow', desc: 'Treat them to their next skincare obsession.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80' },
        { title: 'Gifts for Good Hair', desc: 'Their ticket to glossy, salon-level shine.', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&auto=format&fit=crop&q=80' },
        { title: 'Makeup, Wrapped Up', desc: 'All is bright, all is glowy.', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80' },
        { title: 'All-Over Indulgence', desc: 'Something beautiful for every body.', img: 'https://images.unsplash.com/photo-1556228720-1987df3629e5?w=600&auto=format&fit=crop&q=80' }
      ].map((item, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="aspect-square overflow-hidden mb-4 bg-gray-100">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <h3 className="text-lg font-bold mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const CuratedSection: React.FC = () => (
  <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto bg-[#FAFAFA]">
    <div className="flex justify-between items-end mb-8">
      <h2 className="text-3xl font-normal border-b border-black pb-1">Curated for you</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
    </div>
  </section>
);

const TrendingSection: React.FC = () => (
  <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
    <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">What Everyone<br />Wants</h2>
        <p className="text-base text-gray-600 mb-6">The limited-edition beauty on every wishlist - with a charm on top!</p>
        <button className="underline text-base font-bold hover:text-gray-600">Shop now</button>
      </div>
      <div className="flex-3 w-full overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 min-w-max">
          {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
            <div key={i} className="w-[200px] md:w-[250px]">
              <ProductCard product={{ ...p, id: `trend-${i}` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const VideoSection: React.FC = () => (
  <section className="w-full relative group">
    <div className="w-full aspect-video md:h-[600px] md:aspect-auto overflow-hidden bg-gray-100 relative">
      <img
        src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2000&auto=format&fit=crop"
        alt="Video Thumbnail"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
          <Play className="w-6 h-6 text-white fill-current ml-1" />
        </button>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 bg-white pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">Customer Care</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Help & Contact Us</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Shipping & Delivery</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Returns & Exchanges</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Payment & Security</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Online Orders</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">About us</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Our Story</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Beauty Loop</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Careers</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">M-POWER</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">M-PACT</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">Visit us</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Store Locator</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Services & Events</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">Discover Flagship</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">MECCA Aesthetica</a>
          </div>

          <div className="flex flex-col justify-end">
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <p className="text-xs leading-relaxed text-gray-500 max-w-3xl mb-8">
            MECCA commits to being allies and working in solidarity with First Nations people. We recognise their ongoing connection to this beautiful country, and we pay our respects to Elders, past and present. We acknowledge the land on which we live and work always was, and always will be, Aboriginal Land.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:opacity-70">
                <Globe className="w-4 h-4" />
                <span>United States</span>
              </div>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">Terms and Conditions</a>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">Privacy Policy</a>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">Website Policies</a>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold mr-2">Connect</span>
              <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface ProductListingPageProps {
  category: string;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ category }) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <div className="mb-8 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-normal mb-2">
          {category === 'SHOP ALL' ? 'All Products' : category}
        </h1>
        <p className="text-sm text-gray-500">22 results</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 relative">
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto pr-4 custom-scrollbar">
          <div className="border-t border-black">
            {FILTER_DATA.map((filter) => (
              <FilterFacet key={filter.id} filter={filter} />
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div className="md:hidden text-sm font-medium flex items-center gap-1">
              Filter <Plus className="w-3 h-3" />
            </div>
            <div className="ml-auto flex items-center gap-2 cursor-pointer text-base group">
              <span className="text-gray-500 group-hover:text-black transition-colors">Sort by</span>
              <span className="font-medium underline decoration-gray-300 underline-offset-4 group-hover:decoration-black transition-all">Best Sellers</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {MOCK_PRODUCTS.map((product) => <ProductCard key={`p1-${product.id}`} product={product} />)}
            {MOCK_PRODUCTS.slice(0, 4).map((product) => <ProductCard key={`p2-${product.id}`} product={{ ...product, id: `dup-${product.id}` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AITrioPickerProps {
  onSelectTrio: (flavors: Flavor[]) => void;
}

const AITrioPicker: React.FC<AITrioPickerProps> = ({ onSelectTrio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError("");

    try {
      const apiKey = "";
      const userQuery = `
        You are a helpful shopping assistant. Pick 3 distinct lip balm flavors from the list below that best match the user's request.
        List: ${FLAVORS.map(f => f.id + ': ' + f.name + ' (' + f.description + ')').join(', ')}
        User Request: ${prompt}
        Output format: JSON array of strings (IDs only). Example: ["rose", "mint", "coconut"]
        Do not include markdown formatting or explanations. Just the JSON array.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userQuery }] }] })
      });

      if (!response.ok) throw new Error('API Call failed');

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const pickedIds: string[] = JSON.parse(cleanedText);
        const selectedFlavors = pickedIds.map(id => FLAVORS.find(f => f.id === id)).filter((f): f is Flavor => f !== undefined);

        if (selectedFlavors.length === 3) {
          onSelectTrio(selectedFlavors);
          setIsOpen(false);
          setPrompt("");
        } else {
          setError("Couldn't find enough matching flavors. Try again!");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-6 bg-linear-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-black py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-all font-medium border border-transparent hover:border-pink-300"
      >
        <Sparkles className="w-5 h-5 text-purple-600" />
        <span className="text-base">AI Mood Matcher</span>
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-sm relative animate-in fade-in slide-in-from-top-2">
      <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-black">
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-base font-bold mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        Describe your vibe
      </h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. A cozy winter night by the fire..."
        className="w-full text-sm p-3 border border-gray-300 rounded-sm mb-3 focus:outline-none focus:border-black min-h-[80px]"
      />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="w-full bg-black text-white text-sm py-2.5 rounded-sm hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Finding perfect match...
          </>
        ) : ("Generate My Trio")}
      </button>
    </div>
  );
};

// --- Main App Component ---

type ViewType = 'HOME' | 'PDP' | 'PLP';

export default function App() {
  const [view, setView] = useState<ViewType>('HOME');
  const [currentCategory, setCurrentCategory] = useState('');

  const [selections, setSelections] = useState<Flavor[]>([
    FLAVORS[2], FLAVORS[3], FLAVORS[0]
  ]);

  const handleSelect = (index: number, flavor: Flavor) => {
    const newSelections = [...selections];
    newSelections[index] = flavor;
    setSelections(newSelections);
  };

  const THUMBNAILS = [
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop'
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <style>{`
        body, .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif; }
      `}</style>

      <Header
        onNavigate={(target, category) => {
          if (target === 'PDP') {
            setView('PDP');
          } else {
            setCurrentCategory(category || '');
            setView('PLP');
          }
          window.scrollTo(0, 0);
        }}
        onLogoClick={() => setView('HOME')}
      />

      <main className="relative z-10">
        {view === 'HOME' && (
          <div className="animate-in fade-in duration-500">
            <HeroSection />
            <BeautyAllAroundSection />
            <CuratedSection />
            <TrendingSection />
            <VideoSection />
          </div>
        )}

        {view === 'PLP' && (
          <ProductListingPage category={currentCategory} />
        )}

        {view === 'PDP' && (
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-100px)]">

              <div className="md:col-span-4 lg:col-span-3 p-6 md:p-10 md:pr-4 flex flex-col h-full overflow-y-auto">
                <h1 className="text-4xl tracking-tight mb-2 font-normal text-black">Balm Dotcom Trio</h1>
                <p className="text-lg text-black mb-4 font-normal">Original formula</p>

                <div className="flex items-center gap-1 mb-6">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-black ml-1 font-normal">(10126)</span>
                </div>

                <div className="inline-block bg-gray-100 text-black text-sm px-3 py-1.5 mb-8 self-start font-normal">
                  Save 13% with this set
                </div>

                <AITrioPicker onSelectTrio={setSelections} />

                <div className="grow">
                  {selections.map((flavor, idx) => (
                    <BalmSelector
                      key={idx}
                      index={idx}
                      selectedFlavor={flavor}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-normal py-4 px-6 text-base transition-colors flex justify-between items-center group">
                      <span>Add to bag</span>
                      <span className="group-hover:opacity-80">
                        <span className="mr-2 line-through text-black font-normal opacity-50">79,500</span>
                        69,500
                      </span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm text-black font-normal">A tube for every mood.</h3>
                    <p className="text-sm text-black leading-relaxed font-normal">
                      Treat your lips to a trio of our moisturizing lip balms with our original, cult-favorite formula. Pick any three tubes to satisfy your shade and flavor preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 lg:col-span-5 bg-[#F9F9F9] md:bg-white flex flex-col justify-between relative overflow-hidden">
                <div className="grow flex items-center justify-center p-10 relative min-h-[400px]">
                  <div className="flex items-end justify-center gap-4 md:gap-8 transform translate-y-10">
                    <TubeVisual flavor={selections[0]} rotation={-5} />
                    <TubeVisual flavor={selections[1]} rotation={0} />
                    <TubeVisual flavor={selections[2]} rotation={5} />
                  </div>
                </div>

                <div className="p-4 flex gap-2 overflow-x-auto pb-8 justify-center">
                  <div className="w-16 h-16 border border-black cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="w-2 h-8 bg-pink-400 -rotate-12 rounded-sm" />
                      <div className="w-2 h-8 bg-red-400 rotate-0 mx-1 rounded-sm" />
                      <div className="w-2 h-8 bg-yellow-400 rotate-12 rounded-sm" />
                    </div>
                  </div>
                  {THUMBNAILS.map((thumbUrl, i) => (
                    <div key={i} className="w-16 h-16 border border-transparent hover:border-gray-200 cursor-pointer overflow-hidden relative grayscale hover:grayscale-0 transition-all">
                      <img
                        src={thumbUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gray-100 -z-10" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-4 relative h-[calc(100vh-100px)] overflow-hidden">
                <div className="absolute inset-0 bg-[#F0EAE5]">
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                      alt="Cake with Balm"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 flex gap-4">
                  <button className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
