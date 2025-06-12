import type {
  Context,
  UnknownParams,
} from 'openapi-backend';

declare namespace Components {
    namespace Schemas {
        export interface Subscription {
            /**
             * The id of the subscription
             */
            id: string;
            /**
             * The user provided name for the zapier trigger
             */
            triggerName?: string;
            /**
             * The id of the zapier zap integration
             */
            zapId?: string;
            createdAt: string; // date-time
        }
    }
}
declare namespace Paths {
    namespace ListHookSubscriptions {
        namespace Responses {
            export interface $200 {
                subscriptions: Components.Schemas.Subscription[];
            }
        }
    }
    namespace ReceiveHook {
        export interface RequestBody {
            /**
             * The timestamp of the action
             * example:
             * 2023-10-01T12:00:00Z
             */
            timestamp?: string; // date-time
            /**
             * The data to be forwarded to the zapier trigger
             */
            data: {
                /**
                 * The id of the epilot organization
                 * example:
                 * 123
                 */
                org_id: string;
                action_config: {
                    /**
                     * The id of the selected subscription for the automation action
                     * example:
                     * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
                     */
                    subscriptionId: string;
                };
            };
        }
        namespace Responses {
            export interface $200 {
            }
            export interface $400 {
            }
            export interface $401 {
            }
            export interface $403 {
            }
            export interface $404 {
            }
        }
    }
    namespace SubscribeHook {
        export interface RequestBody {
            /**
             * The url of the zapier trigger hook
             */
            hookUrl: string; // uri
            /**
             * The id of the zapier zap integration
             * example:
             * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
             */
            zapId?: string;
            /**
             * The user provided name of the zapier trigger
             */
            triggerName?: string;
            /**
             * Whether this is a temporary subscription for testing the auth flow
             */
            isTestingAuth?: boolean;
            /**
             * Whether this is a temporary subscription for loading the sample integration
             */
            isLoadingSample?: boolean;
        }
        namespace Responses {
            export type $201 = Components.Schemas.Subscription;
        }
    }
    namespace UnsubscribeHook {
        namespace Parameters {
            /**
             * The id of the subscription
             * example:
             * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
             */
            export type Id = string;
        }
        export interface QueryParameters {
            id: /**
             * The id of the subscription
             * example:
             * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
             */
            Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Subscription;
        }
    }
}


export interface Operations {
  /**
   * POST /hooks/receive
   */
  ['receiveHook']: {
    requestBody: Paths.ReceiveHook.RequestBody;
    params: UnknownParams;
    query: UnknownParams;
    headers: UnknownParams;
    cookies: UnknownParams;
    context: Context<Paths.ReceiveHook.RequestBody, UnknownParams, UnknownParams, UnknownParams, UnknownParams>;
    response: Paths.ReceiveHook.Responses.$200 | Paths.ReceiveHook.Responses.$400 | Paths.ReceiveHook.Responses.$401 | Paths.ReceiveHook.Responses.$403 | Paths.ReceiveHook.Responses.$404;
  }
  /**
   * GET /hooks/subscriptions
   */
  ['listHookSubscriptions']: {
    requestBody: any;
    params: UnknownParams;
    query: UnknownParams;
    headers: UnknownParams;
    cookies: UnknownParams;
    context: Context<any, UnknownParams, UnknownParams, UnknownParams, UnknownParams>;
    response: Paths.ListHookSubscriptions.Responses.$200;
  }
  /**
   * POST /hooks/subscribe
   */
  ['subscribeHook']: {
    requestBody: Paths.SubscribeHook.RequestBody;
    params: UnknownParams;
    query: UnknownParams;
    headers: UnknownParams;
    cookies: UnknownParams;
    context: Context<Paths.SubscribeHook.RequestBody, UnknownParams, UnknownParams, UnknownParams, UnknownParams>;
    response: Paths.SubscribeHook.Responses.$201;
  }
  /**
   * DELETE /hooks/unsubscribe
   */
  ['unsubscribeHook']: {
    requestBody: any;
    params: UnknownParams;
    query: Paths.UnsubscribeHook.QueryParameters;
    headers: UnknownParams;
    cookies: UnknownParams;
    context: Context<any, UnknownParams, Paths.UnsubscribeHook.QueryParameters, UnknownParams, UnknownParams>;
    response: Paths.UnsubscribeHook.Responses.$200;
  }
}

export type OperationContext<operationId extends keyof Operations> = Operations[operationId]["context"];
export type OperationResponse<operationId extends keyof Operations> = Operations[operationId]["response"];
export type HandlerResponse<ResponseBody, ResponseModel = Record<string, any>> = ResponseModel & { _t?: ResponseBody };
export type OperationHandlerResponse<operationId extends keyof Operations> = HandlerResponse<OperationResponse<operationId>>;
export type OperationHandler<operationId extends keyof Operations, HandlerArgs extends unknown[] = unknown[]> = (...params: [OperationContext<operationId>, ...HandlerArgs]) => Promise<OperationHandlerResponse<operationId>>;


export type Subscription = Components.Schemas.Subscription;
