export { default as db } from './mockDb.json';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Stock = {
  product_id: Product['id'];
  count: number;
};
