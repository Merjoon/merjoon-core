import { MeisterApi } from '../api';
import { IMeisterConfig } from '../type';
const token = process.env.MEISTER_TOKEN ?? undefined;

describe('Meister Api', () => {
  let meister: MeisterApi;
  let config: IMeisterConfig;

  beforeEach(() => {
    config = {
      token,
      limit: 10,
    };
    meister = new MeisterApi(config);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let pageCount: number;
    let itemsCount: number;
    beforeEach(() => {
      getRecordsSpy = jest.spyOn(meister, 'getRecords');
    });
    afterEach(() => {
      pageCount = itemsCount % meister.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / meister.limit);
      if (pageCount === 0) {
        totalPagesCalledCount += 1;
      }
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });
    describe('GetAllTasks', () => {
      it('should iterate over all tasks and fetch all pages', async () => {
        const allTasks = await meister.getAllTasks();
        itemsCount = allTasks.length;
      });
    });
    describe('getAllProjects', () => {
      it('should iterate over all projects and fetch all pages', async () => {
        const allProjects = await meister.getAllProjects();
        itemsCount = allProjects.length;
      });
    });
  });
  describe('getAllTasks', () => {
    it('should parse Tasks data correctly', async () => {
      const tasks = await meister.getAllTasks();
      expect(tasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          section_name: expect.any(String),
          project_id: expect.any(Number),
          created_at: expect.any(String),
          assigned_to_id: expect.any(Number),
          assignee_name: expect.any(String),
          updated_at: expect.any(String),
          notes: expect.any(String),
        }),
      );
    });
  });
  describe('getAllProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await meister.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });
  describe('getPersons', () => {
    it('should parse Persons data correctly', async () => {
      const persons = await meister.getPersons();
      expect(persons[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });
});
