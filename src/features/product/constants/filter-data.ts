import type { Filter } from '@/shared/types/glossier'

export const FILTER_DATA: Filter[] = [
  {
    id: 'price',
    title: 'Price',
    type: 'radio',
    isOpen: false,
    options: [
      { label: '$0 - $25', count: 12 },
      { label: '$25 - $50', count: 18 },
      { label: '$50 - $75', count: 8 },
      { label: '$75 - $100', count: 6 },
      { label: '$100+', count: 5 },
    ],
  },
  {
    id: 'category',
    title: 'By category',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Skincare', count: 15 },
      { label: 'Makeup', count: 12 },
      { label: 'Bath & Body', count: 8 },
      { label: 'Hair', count: 6 },
      { label: 'Fragrance', count: 4 },
    ],
  },
  {
    id: 'brand',
    title: 'Brand',
    type: 'checkbox',
    hasSearch: true,
    isOpen: false,
    options: [
      { label: 'MECCA MAX', count: 8 },
      { label: 'MECCA COSMETICA', count: 6 },
      { label: 'MECCA M-Power', count: 4 },
      { label: 'Glossier', count: 10 },
      { label: 'Laneige', count: 3 },
    ],
  },
  {
    id: 'ingredient',
    title: 'Ingredient preferences',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Vegan', count: 12 },
      { label: 'Cruelty-free', count: 20 },
      { label: 'Fragrance-free', count: 8 },
      { label: 'Paraben-free', count: 15 },
    ],
  },
  {
    id: 'skin-concerns',
    title: 'Skin concerns',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Dryness', count: 10 },
      { label: 'Acne', count: 8 },
      { label: 'Aging', count: 12 },
      { label: 'Sensitivity', count: 6 },
    ],
  },
  {
    id: 'skin-type',
    title: 'Skin type',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Dry', count: 15 },
      { label: 'Oily', count: 12 },
      { label: 'Combination', count: 18 },
      { label: 'Sensitive', count: 8 },
    ],
  },
  {
    id: 'form',
    title: 'Form',
    type: 'checkbox',
    isOpen: false,
    options: [
      { label: 'Cream', count: 12 },
      { label: 'Serum', count: 10 },
      { label: 'Oil', count: 6 },
      { label: 'Gel', count: 8 },
    ],
  },
]

