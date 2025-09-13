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
        maxRetries: 1,
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

      expect(sendRequestMock).toHaveBeenCalledTimes(2);
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

      await expect(promise).rejects.toThrow(
        new HttpError({
          data: 'Internal server error',
          status: 500,
          headers: {},
        }),
      );
      expect(sendRequestMock).toHaveBeenCalledTimes(1);
    });

    it('should respect maxRetries = 0', async () => {
      api = new ClickUpApi({
        apiKey: 'test-key',
        maxSockets: 10,
        maxRetries: 0,
      });

      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementation(() => {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${Math.round(Date.now() / 1000) + 1}`,
            },
          });
        });

      const promise = api.getTeams();
      await expect(promise).rejects.toThrow(
        new HttpError({
          data: 'Rate limited',
          status: 429,
          headers: {
            'x-ratelimit-reset': `${Math.round(Date.now() / 1000) + 1}`,
          },
        }),
      );
      expect(sendRequestMock).toHaveBeenCalledTimes(1);
    });

    it('should respect maxRetries < 0', async () => {
      api = new ClickUpApi({
        apiKey: 'test-key',
        maxSockets: 10,
        maxRetries: -1,
      });

      const sendRequestMock = jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockImplementation(() => {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${Math.round(Date.now() / 1000) + 1}`,
            },
          });
        });

      const promise = api.getTeams();
      await expect(promise).rejects.toThrow(
        new HttpError({
          data: 'Rate limited',
          status: 429,
          headers: {
            'x-ratelimit-reset': `${Math.round(Date.now() / 1000) + 1}`,
          },
        }),
      );
      expect(sendRequestMock).toHaveBeenCalledTimes(1);
    });
  });
});
