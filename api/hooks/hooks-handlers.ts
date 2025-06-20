import { dynamodb } from '../dynamodb/dynamodb-client';
import { v4 as uuidv4 } from 'uuid';  // Ensure this package is added to your project
import { replyJSON } from "../utils/lambda";
import { OperationHandler } from "../openapi";
import { verifyToken } from "../utils/auth";
import { logger } from '../utils/logger';
import axios from 'axios';
import createHttpError from 'http-errors';
import { Resource } from 'sst';

export const subscribeHook: OperationHandler<'subscribeHook'> = async (c) => {
  const { orgId } = verifyToken(c);
  const { hookUrl, zapId, triggerName, isTestingAuth, isLoadingSample } = c.request.requestBody;

  // check for previous subscriptions with the same triggerName 
  const prevSubscriptions = await dynamodb.query({
    TableName: Resource.ZapierIntegrationTable.name,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `ORG#${orgId}`,
      ":triggerName": triggerName,
    },
    FilterExpression: "triggerName = :triggerName",
  }).then((res) => res.Items ?? []);

  // sort subscriptions by createdAt descending
  prevSubscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // use the id if there is a previous subscription, otherwise generate a new one
  const subscriptionId = prevSubscriptions[0]?.id || uuidv4();

  if (prevSubscriptions.length) {
    logger.info('cleaning up old subscriptions', { orgId, testSubscriptions: prevSubscriptions });
    for (const testSubscription of prevSubscriptions) {
      await dynamodb.delete({
        TableName: Resource.ZapierIntegrationTable.name,
        Key: {
          pk: `ORG#${orgId}`,
          sk: `SUBSCRIPTION#${testSubscription.id}`,
        },
      });
    }
  }

  const createdAt = new Date().toISOString();
  const item = {
    pk: `ORG#${orgId}`,
    sk: `SUBSCRIPTION#${subscriptionId}`,
    id: subscriptionId,
    hookUrl,
    zapId,
    triggerName,
    createdAt,
    isTestingAuth,
    isLoadingSample,
  };

  await dynamodb.put({
    TableName: Resource.ZapierIntegrationTable.name,
    Item: item,
  });

  return replyJSON({ id: subscriptionId, triggerName, zapId, createdAt });
};

export const unsubscribeHook: OperationHandler<'unsubscribeHook'> = async (c) => {
  const { orgId } = verifyToken(c);
  const subscriptionId = c.request.query.id;

  const deleteRes = await dynamodb.delete({
    TableName: Resource.ZapierIntegrationTable.name,
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
    TableName: Resource.ZapierIntegrationTable.name,
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
  logger.debug('receiveHook start', { request: c.request.requestBody });

  // @TODO: verify signature

  // get subscription by the configured subscriptionId
  const subscriptionId = c.request.requestBody.data.action_config.custom_action_config.subscriptionId;
  const orgId = c.request.requestBody.data.org_id;

  const subscription = await dynamodb.get({
    TableName: Resource.ZapierIntegrationTable.name,
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
  const zapierResponse = await axios.post(hookUrl, c.request.requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': "epilot-zapier-app",
    },
    validateStatus: () => true, // pass through all status codes
  });

  logger.info('receiveHook finished', { zapierResponse });

  return replyJSON(zapierResponse.data, { statusCode: zapierResponse.status, headers: zapierResponse.headers as any });
};
