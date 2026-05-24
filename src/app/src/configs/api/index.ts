import { IHttpConfig, IHttpListeners } from "./types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Método padrão para requisição HTTP
 * @param config Parâmetro com as configurações da requisição como token, path, etc.
 * @param listeners Funções que serão executadas em caso de sucesso ou de erro
 * @returns void
 * Lembre-se de passar para a função a tipagem dos dados tanto para erro quanto para sucesso.
 * ```Javascript
 * // exemplo: TUserData é o tipo usado para sucesso e TError é o tipo para error
 * const data = await request<TUserData, TErrorData>( ... )
 * ```
 *
 * Exemplo de uso da função
 * ```Javascript
 * type TUserData = { .. } // dados do usuário esperados na API
 * type TErrorData = { .. } // dados esperados quando ocorre erro na request
 *
 * const listener = {
 *  onSuccess: (data: TUsertData) => console.log(data),
 *  onError: (error: TErrorData) => console.log(`Message: ${error}`)
 * }
 *
 * const config: IHttpConfig = {
 *  path: "/user",
 *  headers: {..} // adicione os campos do header como o token, por exemplo
 *  method: 'GET'
 *  ...
 * }
 * // Ao fim da request uma das funções será executada: erro ou sucesso
 * await request<TUserData, TErrorData>(config, listener);
 * ```
 */
const request = async <TSuccess, TError>(
  config: IHttpConfig,
  listeners: IHttpListeners<TSuccess, TError>,
): Promise<unknown> => {
  const url = `${BASE_URL}${config.path}`;
  console.log(`[http] ${config.method} ${url}`);

  try {
    if (config.requestInterceptor) {
      config.requestInterceptor({ ...config, url });
    }

    const response = await fetch(url, {
      ...config,
      signal: config.controller?.signal,
    });

    console.log(`[http] ${config.method} ${config.path} → ${response.status}`);

    if (response.ok) {
      if (config.responseInterceptor) {
        await config.responseInterceptor(response.clone());
      }
      const data: TSuccess = await response.json();
      return listeners?.onSuccess(data);
    }

    if (config.errorInterceptor) {
      await config.errorInterceptor(response.clone());
    }

    const contentType = response.headers.get("content-type") ?? "";
    const err: TError = contentType.includes("application/json")
      ? await response.json()
      : ({} as TError);
    console.error(`[http] erro ${response.status}:`, JSON.stringify(err));
    listeners.onError(err);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[http] exceção:`, error.name, error.message);
      if (error.name === "AbortError") {
        return listeners.onAbort && listeners.onAbort(error);
      }
    }
    return listeners.onError(error as TError);
  }
};

export { request };
export {IHttpConfig} from './types'
