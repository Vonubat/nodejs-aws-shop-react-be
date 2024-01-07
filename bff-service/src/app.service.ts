import { Injectable } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import axios, { AxiosError } from 'axios';

import { parseOriginalUrl, Recipient } from './utils';

@Injectable()
export class AppService {
  mainProxy(req: ExpressRequest, res: ExpressResponse) {
    const recipient = req.originalUrl.split('/').at(-1).toUpperCase();
    console.log('recipient', recipient);

    const recipientURL = parseOriginalUrl(req.originalUrl);
    console.log('recipientURL', recipientURL);

    if (recipientURL.url) {
      const axiosConfig = {
        method: req.method,
        url: recipientURL.url,
        headers: recipientURL.type === Recipient.CART ? req.headers : undefined,
        ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
      };

      console.log('axiosConfig', axiosConfig);

      return axios(axiosConfig)
        .then((response) => {
          console.log('Response from recipient', response.data);
          return res.json(response.data);
        })
        .catch((e) => {
          console.error(e);
          if (e instanceof AxiosError) {
            const { status, data } = e.response;
            return res.status(status).json(data);
          } else {
            return res.status(500).json({ error: e.message });
          }
        });
    } else {
      return res.status(502).json({ error: 'Cannot process request' });
    }
  }
}
