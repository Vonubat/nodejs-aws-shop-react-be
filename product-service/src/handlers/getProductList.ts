import { Res, basicHeaders } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';

import { default as db } from '../db/mockDb.json';

export const handler = async (event: any): Promise<Res> => {
  try {
    console.log('getProductList_EVENT:', event);

    return buildResponse(200, { products: db }, basicHeaders);
  } catch (e) {
    return buildResponse(500, { message: getSaveErrorMsg(e) }, basicHeaders);
  }
};
