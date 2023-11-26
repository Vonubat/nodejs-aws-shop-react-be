import { Product, db } from '../db';

export const getOne = ({ id }: { id: string }): Product | undefined => {
  return db.find((it) => it.id === parseInt(id));
};
