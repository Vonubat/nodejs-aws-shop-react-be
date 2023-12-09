import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ErrMsg, bucketName, prefix, region } from '../constants';

export const importProductsFileService = (fileName: string) => {
  const key = `${prefix}${fileName}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: 'text/csv',
  };

  const command = new PutObjectCommand(params);
  const client = new S3Client({ region });

  return getSignedUrl(client, command)
    .then((url) => url)
    .catch(() => {
      throw new Error(ErrMsg.S3_CLIENT_ERROR);
    })
    .catch(() => {
      throw new Error(ErrMsg.S3_CLIENT_ERROR);
    });
};
