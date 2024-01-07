export const enum Recipient {
  CART = 'CART',
  PRODUCTS = 'PRODUCTS',
  UNDEFINED = '',
}

export function parseOriginalUrl(url: string): {
  url: string | null;
  type: Recipient;
} {
  const result: { url: string | null; type: Recipient } = {
    url: null,
    type: Recipient.UNDEFINED,
  };

  const isCart = url.includes('cart');
  const isProducts = url.includes('products');

  if (!isCart && !isProducts) {
    return result;
  } else if (isCart) {
    result.type = Recipient.CART;
  } else {
    result.type = Recipient.PRODUCTS;
  }

  let recipient = url.split('/').at(-1).toUpperCase();
  let recipientURL = process.env[recipient];

  if (recipientURL) {
    result.url = recipientURL;
  } else {
    recipient = url.split('/').at(-2).toUpperCase();
    recipientURL = process.env[recipient];

    if (recipientURL) {
      result.url = `${recipientURL}${url.split('/').at(-1)}`;
    }
  }

  return result;
}
