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
