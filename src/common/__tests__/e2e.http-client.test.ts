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
    const requests = Array.from({ length: 100 }, () => httpClient.get({ path: '' }));
    await Promise.all(requests);
    expect(httpClientServer.maxConnections).toEqual(10);
  });

  it('should handle connections without HTTP agent', async () => {
    const config: IMerjoonApiConfig = { baseURL: httpClientServer.baseUrl };
    httpClient = new HttpClient(config);
    const requests = Array.from({ length: 100 }, () => httpClient.get({ path: '' }));
    await Promise.all(requests);
    expect(httpClientServer.maxConnections).toEqual(100);
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
    return http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, world!' }));
      }, 100);
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
