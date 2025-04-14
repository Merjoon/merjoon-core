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
    jest.clearAllMocks();
  });
  describe('HTTP agent e2e test', () => {
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
  });
  describe('SendRequest e2e test', () => {
    it('should return correct response structure for successful request', async () => {
      const config: IMerjoonApiConfig = {
        baseURL: httpClientServer.baseUrl,
      };
      httpClient = new HttpClient(config);

      const response = await httpClient.get({
        path: '',
      });
      expect(response.data).toEqual({
        message: 'Hello, world!',
      });
      expect(response).toHaveProperty('status', 200);
      expect(response).toHaveProperty('headers.content-type', 'application/json');
    });

    it('should return correct response structure for failed request', async () => {
      expect.assertions(3);
      const config: IMerjoonApiConfig = {
        baseURL: httpClientServer.baseUrl,
      };
      httpClient = new HttpClient(config);

      try {
        await httpClient.get({
          path: 'users',
        });
      } catch (error) {
        expect(error).toHaveProperty('status', 404);
        expect(error).toHaveProperty('data.message', 'Page not Found');
        expect(error).toHaveProperty('headers.content-type', 'application/json');
      }
    });

    it('should throw original error when error is not AxiosError', async () => {
      expect.assertions(2);
      const config: IMerjoonApiConfig = {
        baseURL: httpClientServer.baseUrl,
      };
      httpClient = new HttpClient(config);

      const notAxiosError = new Error('unknown error');

      jest.spyOn(httpClient, 'get').mockRejectedValueOnce(notAxiosError);

      try {
        await httpClient.get({
          path: '',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'unknown error');
      }
    });
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
