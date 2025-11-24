import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

declare interface RequestConfig<Body, Query> extends AxiosRequestConfig<Body> {
  data?: Body;
  params?: Query;
}

@Injectable()
export class HttpService {
  private readonly http = axios.create();

  constructor() {}

  get<Response = any, Data = any, Query = Data>(
    url: string,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.get(url, config);
  }

  delete<Response = any, Data = any, Query = Data>(
    url: string,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.delete(url, config);
  }

  head<Response = any, Data = any, Query = Data>(
    url: string,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.head(url, config);
  }

  options<Response = any, Data = any, Query = Data>(
    url: string,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.options(url, config);
  }

  post<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.post(url, data, config);
  }

  put<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.put(url, data, config);
  }

  patch<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.patch(url, data, config);
  }

  postForm<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.postForm(url, data, config);
  }

  putForm<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.putForm(url, data, config);
  }

  patchForm<Response = any, Data = any, Query = Data>(
    url: string,
    data?: Data,
    config?: RequestConfig<Data, Query>,
  ): Promise<AxiosResponse<Response>> {
    return this.http.patchForm(url, data, config);
  }
}
