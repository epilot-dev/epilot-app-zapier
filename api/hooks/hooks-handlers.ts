import { dynamodb } from '../dynamodb/dynamodb-client';
import { v4 as uuidv4 } from 'uuid';  // Ensure this package is added to your project
import { replyJSON } from "../utils/lambda";
import { OperationHandler } from "../openapi";
import { config } from "../config";
import { verifyToken } from "../utils/auth";
import { logger } from '../utils/logger';
import axios from 'axios';
import createHttpError from 'http-errors';

export const subscribeHook: OperationHandler<'subscribeHook'> = async (c) => {
  const { orgId } = verifyToken(c);
  const { hookUrl, zapId, triggerName } = c.request.requestBody;

  const subscriptionId = uuidv4();
  const createdAt = new Date().toISOString();

  const item = {
    pk: `ORG#${orgId}`,
    sk: `SUBSCRIPTION#${subscriptionId}`,
    id: subscriptionId,
    hookUrl,
    zapId,
    triggerName,
    createdAt,
  };

  await dynamodb.put({
    TableName: config.ZAPIER_INTEGRATION_TABLE,
    Item: item,
  });

  return replyJSON({ id: subscriptionId, triggerName, zapId, createdAt });
};

export const unsubscribeHook: OperationHandler<'unsubscribeHook'> = async (c) => {
  const { orgId } = verifyToken(c);
  const subscriptionId = c.request.query.id;

  const deleteRes = await dynamodb.delete({
    TableName: config.ZAPIER_INTEGRATION_TABLE,
    Key: {
      pk: `ORG#${orgId}`,
      sk: `SUBSCRIPTION#${subscriptionId}`,
    },
    ReturnValues: 'ALL_OLD',
  });

  return replyJSON({
    id: deleteRes.Attributes?.id ?? subscriptionId,
    triggerName: deleteRes.Attributes?.triggerName,
    zapId: deleteRes.Attributes?.zapId,
    createdAt: deleteRes.Attributes?.createdAt,
  });
};

export const listHookSubscriptions: OperationHandler<'listHookSubscriptions'> = async (c) => {
  const { orgId } = verifyToken(c);

  const result = await dynamodb.query({
    TableName: config.ZAPIER_INTEGRATION_TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `ORG#${orgId}`,
    },
  });

  const subscriptions = result.Items?.map(item => ({
    id: item.id,
    triggerName: item.triggerName,
    zapId: item.zapId,
    createdAt: item.createdAt,
  })) ?? [];

  // sort subscriptions by createdAt descending
  subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return replyJSON({ subscriptions });
};

export const receiveHook: OperationHandler<'receiveHook'> = async (c) => {
  logger.info('receiveHook', { request: c.request.requestBody });

  // @TODO: verify signature

  // get subscription by the configured subscriptionId
  const subscriptionId = c.request.requestBody.action_config.subscriptionId;
  const orgId = c.request.requestBody.org_id;

  const subscription = await dynamodb.get({
    TableName: config.ZAPIER_INTEGRATION_TABLE,
    Key: {
      pk: `ORG#${orgId}`,
      sk: `SUBSCRIPTION#${subscriptionId}`,
    },
  });

  if (!subscription?.Item?.hookUrl) {
    throw new createHttpError['404']('Webhook subscription not found');
  }

  /**
   * Forward payload to zapier hookUrl
   */
  const hookUrl = subscription.Item.hookUrl;
  const axiosRes = await axios.post(hookUrl, c.request.requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': "epilot-zapier-app",
    }
  });

  return replyJSON(axiosRes.data, { statusCode: 200, headers: axiosRes.headers as any });
};
