import { TodoistApi } from './api';
import { TodoistService } from './service';
import { TodoistTransformer } from './transformer';
import type { ITodoistConfig } from './types';

export function getTodoistService(): TodoistService {
  const { TODOIST_TOKEN } = process.env;

  if (!TODOIST_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }

  const config: ITodoistConfig = {
    token: TODOIST_TOKEN,
  };

  const api: TodoistApi = new TodoistApi(config);
  const transformer: TodoistTransformer = new TodoistTransformer();
  return new TodoistService(api, transformer);
}
