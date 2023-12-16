import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ErrMsg, HttpStatusCode, importProductsTopicArn, region } from '../constants';
import { buildResponse, getSaveErrorMsg, parseBody, validateBody } from '../utils';

import { createProductService } from '../services/createProductService';

export const handler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
  console.log(`catalogBatchProcessLambda: ${JSON.stringify(event)}`);

  try {
    const records = event.Records;
    const snsClient = new SNSClient({ region });

    for (const it of records) {
      const { body } = it;

      if (!body) {
        return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.MISSING_BODY });
      }

      const parsedBody = parseBody(body);

      if (!validateBody(parsedBody)) {
        return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.BODY_INVALID });
      }

      const product = await createProductService(parsedBody);

      await snsClient.send(
        new PublishCommand({
          Subject: 'New Products Added to Catalog',
          TopicArn: importProductsTopicArn,
          Message: JSON.stringify(product),
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: `${product?.count}`,
            },
          },
        }),
      );
    }

    return buildResponse(HttpStatusCode.OK, records);
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
