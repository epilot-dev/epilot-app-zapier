import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

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
                    custom_action_config: {
                        /**
                         * The id of the selected subscription for the automation action
                         * example:
                         * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
                         */
                        subscriptionId: string;
                    };
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


export interface OperationMethods {
  /**
   * receiveHook - receiveHook
   * 
   * Receive an automation action from epilot to forward to zapier
   */
  'receiveHook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ReceiveHook.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ReceiveHook.Responses.$200>
  /**
   * listHookSubscriptions - listHookSubscriptions
   * 
   * List all hook subscriptions for an organization
   */
  'listHookSubscriptions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListHookSubscriptions.Responses.$200>
  /**
   * subscribeHook - subscribeHook
   * 
   * Subscribe a zapier trigger hook
   */
  'subscribeHook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.SubscribeHook.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.SubscribeHook.Responses.$201>
  /**
   * unsubscribeHook - unsubscribeHook
   * 
   * Unsubscribe a zapier trigger hook
   */
  'unsubscribeHook'(
    parameters?: Parameters<Paths.UnsubscribeHook.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UnsubscribeHook.Responses.$200>
}

export interface PathsDictionary {
  ['/hooks/receive']: {
    /**
     * receiveHook - receiveHook
     * 
     * Receive an automation action from epilot to forward to zapier
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ReceiveHook.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ReceiveHook.Responses.$200>
  }
  ['/hooks/subscriptions']: {
    /**
     * listHookSubscriptions - listHookSubscriptions
     * 
     * List all hook subscriptions for an organization
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListHookSubscriptions.Responses.$200>
  }
  ['/hooks/subscribe']: {
    /**
     * subscribeHook - subscribeHook
     * 
     * Subscribe a zapier trigger hook
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.SubscribeHook.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.SubscribeHook.Responses.$201>
  }
  ['/hooks/unsubscribe']: {
    /**
     * unsubscribeHook - unsubscribeHook
     * 
     * Unsubscribe a zapier trigger hook
     */
    'delete'(
      parameters?: Parameters<Paths.UnsubscribeHook.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UnsubscribeHook.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>


export type Subscription = Components.Schemas.Subscription;
