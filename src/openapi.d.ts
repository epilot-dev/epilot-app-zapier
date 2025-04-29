import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Paths {
    namespace Test {
        namespace Responses {
            /**
             * example:
             * {
             *   "hello": "world"
             * }
             */
            export interface $200 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * test - test
   * 
   * Test operation
   */
  'test'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Test.Responses.$200>
}

export interface PathsDictionary {
  ['/test']: {
    /**
     * test - test
     * 
     * Test operation
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Test.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
