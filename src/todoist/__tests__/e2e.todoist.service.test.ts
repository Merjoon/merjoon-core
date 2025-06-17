import { IMerjoonProjects } from '../../common/types';
import { TodoistService } from '../service';
import { getTodoistService } from '../todoist-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e Todoist service', () => {
  let service: TodoistService;

  beforeEach(async () => {
    service = getTodoistService();
    await service.init();
  });

  it('getProjects', async () => {
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'created_at',
        'modified_at',
        'description',
      ]),
    );

    expect(projects[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
      description: expect.any(String),
    });
  });
});
