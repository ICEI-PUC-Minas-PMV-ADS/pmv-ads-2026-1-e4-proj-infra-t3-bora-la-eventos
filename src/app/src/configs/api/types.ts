export interface IHttpConfig extends RequestInit {
  path: string;
  controller?: AbortController;
  responseInterceptor?: (param: Response) => Promise<unknown>;
  requestInterceptor?: (params: TRequestInterceptor) => void;
  errorInterceptor?: (error: Response) => Promise<unknown>;
}

export interface TRequestInterceptor extends IHttpConfig {
  url: string;
} 

export interface IHttpListeners<TSuccess, TError> {
  onError: (error: TError) => unknown;
  onSuccess: (response: TSuccess) => unknown;
  onAbort?: (error: Error) => unknown;
}