import { Product, Stock, db } from '../db';
import { randomUUID } from 'node:crypto';

export const generateProductData = (): Product[] => {
  return db.map((it) => ({
    id: randomUUID(),
    title: it.title,
    description: it.description,
    price: it.price,
  }));
};

export const generateStockData = (products: Product[]): Stock[] => {
  return products.map((it) => ({
    product_id: it.id,
    count: Math.floor(Math.random() * 100),
  }));
};

export function isProduct(value: any): value is Product {
  return (
    typeof value === 'object' &&
    value.hasOwnProperty('id') &&
    value.hasOwnProperty('title') &&
    value.hasOwnProperty('description') &&
    value.hasOwnProperty('price')
  );
}

export function isStock(value: any): value is Stock {
  return typeof value === 'object' && value.hasOwnProperty('product_id') && value.hasOwnProperty('count');
}
