import { IHeaderValue } from './types';

interface HttpRequestErrorDetails<T = unknown> {
  data?: T;
  status?: number;
  headers?: IHeaderValue;
}

export class HttpRequestError<T = unknown> extends Error {
  public readonly data?: T;
  public readonly status?: number;
  public readonly headers?: IHeaderValue;

  constructor(details: HttpRequestErrorDetails<T> = {}) {
    super();
    this.data = details.data;
    this.status = details.status;
    this.headers = details.headers;
  }
}
