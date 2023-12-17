import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Readable } from 'stream';
import csv from 'csv-parser';

import { ErrMsg, bucketName, queueUrl, region } from '../constants';
import { getSaveErrorMsg } from '../utils';

export const importFileParserService = async (key: string) => {
  try {
    const fileName = key.split('/').at(-1);

    if (!fileName) {
      throw new Error(ErrMsg.MISSING_FILE_NAME);
    }

    const srcParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: 'text/csv',
    };

    const destParams = {
      ...srcParams,
      Key: `parsed/${fileName}`,
      CopySource: `${bucketName}/${key}`,
    };

    const getCommand = new GetObjectCommand(srcParams);
    const copyCommand = new CopyObjectCommand(destParams);
    const deleteCommand = new DeleteObjectCommand(srcParams);

    const s3client = new S3Client({ region });
    const sqsClient = new SQSClient({ region });

    const { Body: stream } = await s3client.send(getCommand);

    if (!stream) {
      throw new Error(ErrMsg.STREAM_ERROR_MISSING);
    }

    return new Promise<string>((resolve, reject) => {
      (stream as Readable)
        .pipe(csv())
        .on('data', async (chunk) => {
          const snsCommand = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(chunk),
          };
          await sqsClient.send(new SendMessageCommand(snsCommand));
        })
        .on('end', async () => {
          const message = 'CSV file was parsed successfully!';
          console.log(message);

          try {
            await s3client.send(copyCommand);
            console.log('The file was copied to parsed folder');
            await s3client.send(deleteCommand);
            console.log('The file was deleted from uploaded folder');

            return resolve(message);
          } catch (e) {
            reject(e);
          }
        })
        .on('error', (e) => {
          console.error(ErrMsg.STREAM_ERROR_PARSING, e);
          reject(e);
        });
    }).then((msg) => msg);
  } catch (e) {
    throw new Error(getSaveErrorMsg(e));
  }
};
