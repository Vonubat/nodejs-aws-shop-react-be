import { basicHeaders } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';

export const handler = async (event: any): Promise<Response> => {
  try {
    console.log('getProductList_EVENT:', event);

    return buildResponse(200, { products: [] }, basicHeaders);
  } catch (e) {
    return buildResponse(500, { message: getSaveErrorMsg(e) }, basicHeaders);
  }
};
