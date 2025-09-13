import { HttpError } from '../../common/HttpError';
import { IMerjoonHttpClient } from '../../common/types';
import { HttpClient } from '../../common/HttpClient';
import { ClickUpApi } from '../api';

interface IProtectedHttpClient extends IMerjoonHttpClient {
  sendRequest: HttpClient['sendRequest'];
}

type IHttpClient = IProtectedHttpClient & typeof HttpClient;

describe('clickup unit tests', () => {
  describe('ClickUpApi retry logic', () => {
    let api: ClickUpApi;

    beforeEach(() => {
      api = new ClickUpApi({
        apiKey: 'test-key',
        maxSockets: 10,
        maxRetries: 2,
      });
      jest.resetAllMocks();
    });

    it('retries until maxRetries is reached', async () => {
      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementation(() => {
          const mockResetTime = Math.round(Date.now() / 1000) + 1;
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
        });

      const promise = api.getTeams();
      await expect(promise).rejects.toThrow(HttpError);

      expect(sendRequestMock).toHaveBeenCalledTimes(4);
    });

    it('succeeds after retry when API stops returning 429', async () => {
      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementationOnce(() => {
          const mockResetTime = Math.round(Date.now() / 1000) + 1;
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
        })
        .mockResolvedValueOnce({
          data: {
            teams: [
              {
                ok: true,
              },
            ],
          },
          status: 200,
          headers: {},
        });

      const promise = api.getTeams();
      await expect(promise).resolves.toEqual([
        {
          ok: true,
        },
      ]);
      expect(sendRequestMock).toHaveBeenCalledTimes(2);
    });

    it('alternates success and 429 errors with retry logic', async () => {
      const rateLimit = () => {
        const mockResetTime = Math.round(Date.now() / 1000) + 1;
        throw new HttpError({
          data: 'Rate limited',
          status: 429,
          headers: {
            'x-ratelimit-reset': mockResetTime,
          },
        });
      };
      const promiseResolve = () => {
        return Promise.resolve({
          data: {
            teams: [
              {
                result: 'success',
              },
            ],
          },
          status: 200,
          headers: {},
        });
      };

      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementationOnce(promiseResolve)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(promiseResolve)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(rateLimit)
        .mockImplementationOnce(promiseResolve);

      await Promise.all(
        Array.from(
          {
            length: 5,
          },
          () => api.getTeams().catch(() => Object.create(null)),
        ),
      );

      expect(sendRequestMock).toHaveBeenCalledTimes(11);
    });

    it('handles x-ratelimit-reset header correctly', async () => {
      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementationOnce(() => {
          const mockResetTime = Math.round(Date.now() / 1000) + 1;
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
        })
        .mockResolvedValueOnce({
          data: {
            teams: [
              {
                id: 'team1',
              },
            ],
          },
          status: 200,
          headers: {},
        });

      const promise = api.getTeams();
      await expect(promise).resolves.toEqual([
        {
          id: 'team1',
        },
      ]);
      expect(sendRequestMock).toHaveBeenCalledTimes(2);
    });

    it('does not retry for non-429 errors', async () => {
      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementation(() => {
          throw new HttpError({
            data: 'Internal server error',
            status: 500,
            headers: {},
          });
        });

      const promise = api.getTeams();

      await expect(promise).rejects.toThrow(HttpError);
      expect(sendRequestMock).toHaveBeenCalledTimes(1);
    });
  });
});
