import { ClickUpApi } from '../api';
import { HttpError } from '../../common/HttpError';

describe('clickup unit tests', () => {
  describe('ClickUpApi retry logic', () => {
    let api: ClickUpApi;

    beforeEach(() => {
      jest.useFakeTimers();
      api = new ClickUpApi({
        apiKey: 'test-key',
        maxSockets: 10,
        maxRetries: 3,
      });
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    it('retries until maxRetries is reached', async () => {
      const mockResetTime = Date.now() + 1000;
      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementation(() => {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
        });

      const promise = api.getTeams();
      for (let i = 0; i < 4; i++) {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      }

      await expect(promise).rejects.toThrow(HttpError);
      expect(sendRequestMock).toHaveBeenCalledTimes(5);
    });

    it('succeeds after retry when API stops returning 429', async () => {
      const mockResetTime = Date.now() + 1000;

      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementationOnce(() => {
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

      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      await expect(promise).resolves.toEqual([
        {
          ok: true,
        },
      ]);
      expect(sendRequestMock).toHaveBeenCalledTimes(2);
    });

    it('handles 10 parallel requests with 429 errors and waits each second', async () => {
      const mockResetTime = Date.now() + 1000;

      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementation(() => {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
        });
      const promises = Array.from(
        {
          length: 10,
        },
        () => api.getTeams(),
      );
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      }
      for (const promise of promises) {
        await expect(promise).rejects.toThrow(HttpError);
      }
      expect(sendRequestMock).toHaveBeenCalledTimes(10 * 5);
    });

    it('handles x-ratelimit-reset header correctly', async () => {
      const resetTime = Date.now() + 3000;
      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementationOnce(() => {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${resetTime}`,
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

      jest.advanceTimersByTime(3000);
      await Promise.resolve();

      await expect(promise).resolves.toEqual([
        {
          id: 'team1',
        },
      ]);
      expect(sendRequestMock).toHaveBeenCalledTimes(2);
    });

    it('does not retry for non-429 errors', async () => {
      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
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
