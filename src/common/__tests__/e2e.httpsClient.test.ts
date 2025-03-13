import http from 'http';
import { HttpClient } from '../HttpClient';
import { IMerjoonApiConfig } from '../types';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      message: 'Hello, world!',
    }),
  );
});

let peakConnections = 0;
server.on('connection', () => {
  server.getConnections((err, count) => {
    if (!err) {
      peakConnections = Math.max(peakConnections, count);
    }
  });
});

describe('HttpClient E2E Test', () => {
  const baseURL = 'http://localhost:34000';
  let clientWithHttpAgent: HttpClient;
  let maxSockets = 0;
  let clientWithoutHttpAgent: HttpClient;

  beforeEach(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        server.listen(34000, () => {
          resolve();
        });
      }, 4000);
    });

    const configWithHttpAgent: IMerjoonApiConfig = {
      baseURL: baseURL,
      httpAgent: {
        maxSockets: 10,
        keepAlive: true,
      },
    };

    const configWithoutHttpAgent: IMerjoonApiConfig = {
      baseURL: baseURL,
    };
    clientWithHttpAgent = new HttpClient(configWithHttpAgent);
    clientWithoutHttpAgent = new HttpClient(configWithoutHttpAgent);
    maxSockets = Number(configWithHttpAgent.httpAgent?.maxSockets);
    peakConnections = 0;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  it('should verify the functionality of the HTTP agent', async () => {
    const requests = Array.from({ length: 100 }, () => clientWithHttpAgent.get({ path: '' }));
    await Promise.all(requests);
    expect(peakConnections).toEqual(maxSockets);
  });

  it('should verify functionality without HTTP agent', async () => {
    const requests = Array.from({ length: 10 }, () =>
      clientWithoutHttpAgent.get({ path: '' }).then((res) => {
        return new Promise((resolve) => setTimeout(() => resolve(res), 10)); // Small delay
      }),
    );
    await Promise.all(requests);
    expect(peakConnections).toBeGreaterThan(0);
  });
});
