import { TeamworkTransformer } from "../transformer";
import { TeamworkService } from "../service";
import { ITeamworkConfig } from "../types";
import { TeamworkApi } from "../api";

jest.mock('../api');

describe('detDataFromApi test', () => {
  let service: TeamworkService;
  let mockSendRequest: jest.Mock = jest.fn();

  beforeEach(() => {
    const config: ITeamworkConfig = {
      token: 'test_token',
      password: 'test_password',
      subdomain: 'test_subdomain',
    };

    const api: TeamworkApi = new TeamworkApi(config);
    const transformer: TeamworkTransformer = new TeamworkTransformer();
    service = new TeamworkService(api, transformer);

    api.sendRequest = mockSendRequest;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call sendRequest once with default query params', async () => {
    mockSendRequest.mockResolvedValueOnce({
      people: [],
      STATUS: 'OK',
    });

    const data: AsyncGenerator<any> = service.getDataFromApi('People', 'people');
    const firstIteration = await data.next()

    expect(firstIteration.value).toHaveLength(0);
    expect(firstIteration.done).toBe(false);
    expect(mockSendRequest).toHaveBeenCalledTimes(1);
    expect(mockSendRequest).toHaveBeenCalledWith('people.json', {
      page: 1,
      pageSize: 50,
    });

    jest.clearAllMocks();
    const secondIteration = await data.next();

    expect(secondIteration.value).toBeUndefined();
    expect(secondIteration.done).toBe(true);
    expect(mockSendRequest).not.toHaveBeenCalled();
  });

  it('should call sendRequest Twice with given query params', async () => {
    mockSendRequest.mockResolvedValueOnce({
      'todo-items': [{}, {}, {}],
      STATUS: 'OK',
    });

    const data: AsyncGenerator<any> = service.getDataFromApi('Tasks', 'todo-items', {
      page: 1,
      pageSize: 3
    });

    const firstIteration = await data.next();

    expect(firstIteration.value).toHaveLength(3);
    expect(firstIteration.done).toBe(false);
    expect(mockSendRequest).toHaveBeenCalledTimes(1);
    expect(mockSendRequest).toHaveBeenCalledWith('tasks.json', {
      page: 1,
      pageSize: 3,
    });

    mockSendRequest.mockResolvedValueOnce({
      'todo-items': [{}, {}],
      STATUS: 'OK',
    });

    const secondIteration = await data.next();

    expect(secondIteration.value).toHaveLength(2);
    expect(secondIteration.done).toBe(false);
    expect(mockSendRequest).toHaveBeenCalledTimes(2);
    expect(mockSendRequest).toHaveBeenCalledWith('tasks.json', {
      page: 1,
      pageSize: 3,
    });

    jest.clearAllMocks()
    const lastIteration = await data.next();

    expect(lastIteration.value).toBeUndefined();
    expect(lastIteration.done).toBe(true);
    expect(mockSendRequest).not.toHaveBeenCalled();
  });
});