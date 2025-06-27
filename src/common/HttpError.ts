import { IHeaderValue } from './types';

export interface HttpErrorDetails<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, IHeaderValue>;
}

export class HttpError<T = unknown> extends Error {
  public readonly data: T;
  public readonly status: number;
  public readonly headers: IHeaderValue;

  constructor(details: HttpErrorDetails<T>) {
    super();
    this.data = details.data;
    this.status = details.status;
    this.headers = details.headers;
  }
}
