import { ClickUpApi } from '../api';
import { HttpError } from '../../common/HttpError';

describe('clickup unit tests', () => {
  describe('ClickUpApi retry logic', () => {
    jest.useFakeTimers();
    let api: ClickUpApi;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      api = new ClickUpApi({
        apiKey: 'test-key',
        maxSockets: 10,
        maxRetries: Number(process.env.CLICKUP_MAX_RETRIES) || 3,
      });
    });

    it('retries after 429 rate limit error via public method', async () => {
      const mockData = {
        tasks: [],
        last_page: true,
      };

      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementationOnce(() => {
          const err = new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${Date.now() + 1000}`,
            },
          });
          return Promise.reject(err);
        })
        .mockResolvedValueOnce({
          data: mockData,
        });
      const promise = api.getTasksByListId('123');
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      jest.runOnlyPendingTimers();

      const result = await promise;

      expect(result).toEqual(mockData);
      expect(sendRequestMock).toHaveBeenCalledTimes(2);
    });

    it('retries on every 10th request that throws 429', async () => {
      const totalRequests = 30;
      const mockData = {
        tasks: [],
        last_page: true,
      };

      let callCount = 0;

      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementation(() => {
          callCount++;
          if (callCount % 10 === 0) {
            const err = new HttpError({
              data: 'Rate limited',
              status: 429,
              headers: {
                'x-ratelimit-reset': `${Date.now() + 1000}`,
              },
            });
            return Promise.reject(err);
          }
          return Promise.resolve({
            data: mockData,
          });
        });

      const results = [];

      for (let i = 1; i <= totalRequests; i++) {
        const promise = api.getTasksByListId(`list-${i}`);
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        jest.runOnlyPendingTimers();
        const result = await promise;
        results.push(result);
      }

      results.forEach((res) => expect(res).toEqual(mockData));

      const expectedCalls = totalRequests + Math.floor(totalRequests / 10);
      expect(sendRequestMock).toHaveBeenCalledTimes(expectedCalls);
    });

    it('stops retrying after reaching MAX_RETRIES', async () => {
      const mockResetTime = Date.now() + 100;
      const sendRequestMock = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(api)), 'sendRequest')
        .mockImplementation(() => {
          const err = new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${mockResetTime}`,
            },
          });
          return Promise.reject(err);
        });

      const promise = api.getTasksByListId('list-max-retries');
      for (let i = 0; i < 3; i++) {
        jest.advanceTimersByTime(100);
        await Promise.resolve();
        jest.runOnlyPendingTimers();
      }

      await expect(promise).rejects.toThrow(
        'Max retries reached (3) for GET /list/list-max-retries/task',
      );

      expect(sendRequestMock).toHaveBeenCalledTimes(3);
    });
  });
});
