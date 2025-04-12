import { AddressInfo } from 'node:net';
import http from 'http';
import { HttpClient } from '../HttpClient';
import { IMerjoonApiConfig } from '../types';

jest.setTimeout(15000);

describe('HttpClient E2E Test', () => {
  let httpClient: HttpClient;
  let httpClientServer: HttpServer;

  beforeEach(async () => {
    httpClientServer = new HttpServer();
    await httpClientServer.start();
  });

  afterEach(async () => {
    await httpClientServer.stop();
    jest.restoreAllMocks();
  });

  it('should handle connections with HTTP agent', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: httpClientServer.baseUrl,
      httpAgent: {
        maxSockets: 10,
        keepAlive: true,
      },
    };
    httpClient = new HttpClient(config);
    const requests = Array.from(
      {
        length: 100,
      },
      () =>
        httpClient.get({
          path: '',
        }),
    );
    await Promise.all(requests);
    expect(httpClientServer.maxConnections).toEqual(10);
  });

  it('should handle connections without HTTP agent', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: httpClientServer.baseUrl,
    };
    httpClient = new HttpClient(config);
    const requests = Array.from(
      {
        length: 100,
      },
      () =>
        httpClient.get({
          path: '',
        }),
    );
    await Promise.all(requests);
    expect(httpClientServer.maxConnections).toEqual(100);
  });

  it('should return correct response structure for successful request', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: httpClientServer.baseUrl,
    };
    httpClient = new HttpClient(config);

    const response = await httpClient.get<{ message: string }>({
      path: '',
    });
    expect(response).toHaveProperty('data');
    expect(response.data).toEqual({
      message: 'Hello, world!',
    });
    expect(response).toHaveProperty('status');
    expect(response.status).toBe(200);
    expect(response).toHaveProperty('headers');
    expect(response.headers).toHaveProperty('content-type', 'application/json');
  });

  it('should return correct response structure for failed request', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: httpClientServer.baseUrl,
    };
    httpClient = new HttpClient(config);

    try {
      await httpClient.get<{ message: string }>({
        path: '366536532',
      });
      fail('Expected error not thrown');
    } catch (error) {
      const typedError = error as {
        status: number;
        data: { message: string };
        headers: Record<string, string>;
      };

      expect(typedError).toHaveProperty('status', 404);
      expect(typedError).toHaveProperty('data');
      expect(typedError.data).toHaveProperty('message', 'Page not Found');
      expect(typedError).toHaveProperty('headers');
      expect(typedError.headers).toHaveProperty('content-type', 'application/json');
    }
  });

  it('should throw original error when error is not AxiosError', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: httpClientServer.baseUrl,
    };
    httpClient = new HttpClient(config);

    const notAxiosError = new Error('Network failure');

    jest.spyOn(httpClient, 'get').mockRejectedValueOnce(notAxiosError);

    try {
      await httpClient.get({
        path: '',
      });
      fail('Expected error not thrown');
    } catch (error) {
      expect(error).toBe(notAxiosError);
    }
  });
});

class HttpServer {
  public readonly server: http.Server;
  public baseUrl = '';
  public maxConnections = 0;

  constructor() {
    this.server = this.createServer();
    this.trackConnections();
  }

  private createServer() {
    const handleResponse = (res: http.ServerResponse, statusCode: number, message: string) => {
      setTimeout(() => {
        res.writeHead(statusCode, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            message,
          }),
        );
      }, 100);
    };

    return http.createServer((req, res) => {
      if (req.url === '/') {
        handleResponse(res, 200, 'Hello, world!');
      } else {
        handleResponse(res, 404, 'Page not Found');
      }
    });
  }
  public async start() {
    return new Promise<string>((resolve) => {
      this.server.listen(0, '127.0.0.1', () => {
        const { port, address } = this.server.address() as AddressInfo;
        this.baseUrl = `http://${address}:${port}`;
        resolve(this.baseUrl);
      });
    });
  }

  private trackConnections() {
    this.server.on('connection', () => {
      this.server.getConnections((err, count) => {
        if (!err) {
          this.maxConnections = Math.max(this.maxConnections, count);
        }
      });
    });
  }

  public async stop() {
    return new Promise<void>((resolve) => {
      this.server.close(() => resolve());
    });
  }
}
