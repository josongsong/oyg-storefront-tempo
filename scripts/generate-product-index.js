#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'public', 'cosmetics', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'products-index.json');

async function generateProductIndex() {
  console.log('Generating product index...');
  
  const files = fs.readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.json') && file !== 'products-index.json' && file !== 'product-list.json');
  
  console.log(`Found ${files.length} product files`);
  
  const products = [];
  let processed = 0;
  
  for (const file of files) {
    try {
      const filePath = path.join(DATA_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Extract only necessary fields for list view
      const product = {
        id: data.product_id,
        filename: file, // Store the actual filename for loading full data later
        name: data.product_name,
        brand: data.brand,
        price: data.sale_price,
        originalPrice: data.list_price || null,
        image: data.images?.[0] || data.detailed_images?.[0] || '',
        rating: parseFloat(data.rating_avg) || 0,
        reviewCount: parseInt(data.rating_count) || 0,
        categories: data.categories || [],
        badge: null,
        tags: {
          product_type: data.tags?.product_type || [],
          special_features: data.tags?.special_features || [],
        }
      };
      
      products.push(product);
      processed++;
      
      if (processed % 100 === 0) {
        console.log(`Processed ${processed}/${files.length} products...`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  console.log(`\nGenerated index with ${products.length} products`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

generateProductIndex().catch(console.error);
