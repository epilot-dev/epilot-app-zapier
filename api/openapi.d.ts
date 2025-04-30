import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Paths {
    namespace ReceiveHook {
        export interface RequestBody {
            [name: string]: any;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace SubscribeHook {
        export interface RequestBody {
            /**
             * The url of the zapier trigger hook
             */
            hookUrl: string; // uri
        }
        namespace Responses {
            export interface $201 {
                /**
                 * The id of the subscription
                 * example:
                 * 58b9aa09-969e-4d46-8d4b-8f6c0aa91de8
                 */
                id: string;
            }
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
  ): OperationResponse<any>
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
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>



