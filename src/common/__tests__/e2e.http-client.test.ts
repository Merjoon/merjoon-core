import { AddressInfo } from 'node:net';
import http from 'http';
import { HttpClient } from '../HttpClient';
import { IMerjoonApiConfig } from '../types';

jest.setTimeout(15000);

describe('HttpClient E2E Test', () => {
  let httpClient: HttpClient;
  let server: http.Server;
  let baseUrl: string;
  let maxConnections = 0;

  const createServer = () =>
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, world!' }));
      }, 1000);
    });

  const startServer = async (server: http.Server): Promise<string> => {
    return new Promise((resolve) => {
      server.listen(0, () => {
        const address = server.address() as AddressInfo;
        resolve(`http://localhost:${address.port}`);
      });
    });
  };
  const trackConnections = (server: http.Server) => {
    server.on('connection', () => {
      server.getConnections((err, count) => {
        if (!err) {
          maxConnections = Math.max(maxConnections, count);
        }
      });
    });
  };

  const stopServer = async (server: http.Server) => {
    return new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  };

  beforeEach(async () => {
    maxConnections = 0;
    server = createServer();
    trackConnections(server);
    baseUrl = await startServer(server);
  });

  afterEach(async () => {
    if (server) {
      await stopServer(server);
    }
  });

  const createHttpClient = (config: IMerjoonApiConfig) => new HttpClient(config);

  it('should handle connections with HTTP agent', async () => {
    const config: IMerjoonApiConfig = {
      baseURL: baseUrl,
      httpAgent: {
        maxSockets: 16,
        keepAlive: true,
      },
    };

    httpClient = createHttpClient(config);
    const requests = Array.from({ length: 100 }, () => httpClient.get({ path: '' }));
    await Promise.all(requests);
    expect(maxConnections).toBe(config.httpAgent?.maxSockets);
  });

  it('should handle connections without HTTP agent', async () => {
    const config: IMerjoonApiConfig = { baseURL: baseUrl };
    httpClient = createHttpClient(config);
    const requests = Array.from({ length: 100 }, () => httpClient.get({ path: '' }));
    await Promise.all(requests);
    expect(maxConnections).toBe(requests.length);
  });
});
