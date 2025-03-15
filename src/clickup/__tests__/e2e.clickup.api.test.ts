import axios from 'axios';
import {
  IClickUpTeamResponse,
  IClickUpSpaceResponse,
  IClickUpFolderResponse,
  IClickUpListResponse,
  IClickUpTaskResponse,
} from '../types';

const token = process.env.CLICKUP_API_KEY;
if (!token) {
  throw new Error('ClickUp API key is not set in the environment variables');
}

const BASE_URL = 'https://api.clickup.com/api/v2';

const fetchData = async <T>(url: string): Promise<T> => {
  return axios
    .get(url, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.statusText || error.message || 'Unknown error';
      return Promise.reject(new Error(`Error fetching data: ${errorMessage}`));
    });
};

describe('ClickUp API E2E Tests', () => {
  let teamId: string;
  let spaceId: string;
  let listId: string;

  beforeAll(async () => {
    const url = `${BASE_URL}/team`;
    const data: IClickUpTeamResponse = await fetchData<IClickUpTeamResponse>(url);
    teamId = data.teams[0]?.id || '';

    const spacesData: IClickUpSpaceResponse = await fetchData<IClickUpSpaceResponse>(
      `${BASE_URL}/team/${teamId}/space`,
    );
    spaceId = spacesData.spaces[0]?.id || '';

    const listsData: IClickUpListResponse = await fetchData<IClickUpListResponse>(
      `${BASE_URL}/space/${spaceId}/list`,
    );
    listId = listsData.lists[0]?.id || '';
  });

  describe('getTeams', () => {
    it('should fetch all teams', async () => {
      const url = `${BASE_URL}/team`;
      const data: IClickUpTeamResponse = await fetchData<IClickUpTeamResponse>(url);

      expect(Array.isArray(data.teams)).toBe(true);
      expect(data.teams.length).toBeGreaterThan(0);
    });
  });

  describe('getTeamSpaces', () => {
    it('should fetch all spaces for a given team', async () => {
      const url = `${BASE_URL}/team/${teamId}/space`;
      const data: IClickUpSpaceResponse = await fetchData<IClickUpSpaceResponse>(url);

      expect(Array.isArray(data.spaces)).toBe(true);
      expect(data.spaces.length).toBeGreaterThan(0);
    });
  });

  describe('getSpaceFolders', () => {
    it('should fetch all folders for a given space', async () => {
      const url = `${BASE_URL}/space/${spaceId}/folder`;
      const data: IClickUpFolderResponse = await fetchData<IClickUpFolderResponse>(url);

      expect(Array.isArray(data.folders)).toBe(true);
      expect(data.folders.length).toBeGreaterThan(0);
    });
  });

  describe('getSpaceLists', () => {
    it('should fetch all lists for a given space', async () => {
      const url = `${BASE_URL}/space/${spaceId}/list`;
      const data: IClickUpListResponse = await fetchData<IClickUpListResponse>(url);

      expect(Array.isArray(data.lists)).toBe(true);
      expect(data.lists.length).toBeGreaterThan(0);
    });
  });

  describe('getListAllTasks', () => {
    it('should fetch all tasks for a given list', async () => {
      const url = `${BASE_URL}/list/${listId}/task`;
      const data: IClickUpTaskResponse = await fetchData<IClickUpTaskResponse>(url);

      expect(Array.isArray(data.tasks)).toBe(true);
      expect(data.tasks.length).toBeGreaterThan(0);
    });
  });
});
