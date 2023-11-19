import { Product } from '../constants';
import { default as db } from '../db/mockDb.json';

export const getOne = ({ id }: { id: string }): Product | undefined => {
  return db.find((it) => it.id === parseInt(id));
};
