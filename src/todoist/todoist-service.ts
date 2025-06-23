import { TodoistApi } from './api';
import { TodoistService } from './service';
import { TodoistTransformer } from './transformer';
import { ITodoistConfig } from './types';

export function getTodoistService(): TodoistService {
  const { TODOIST_TOKEN, TODOIST_LIMIT } = process.env;

  if (!TODOIST_TOKEN || !TODOIST_LIMIT) {
    throw new Error('Missing necessary environment variables');
  }

  const config: ITodoistConfig = {
    token: TODOIST_TOKEN,
    limit: Number(TODOIST_LIMIT),
  };

  const api: TodoistApi = new TodoistApi(config);
  const transformer: TodoistTransformer = new TodoistTransformer();
  return new TodoistService(api, transformer);
}
