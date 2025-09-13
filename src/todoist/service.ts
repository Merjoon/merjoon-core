import { IMerjoonProjects, IMerjoonServiceBase, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TodoistApi } from './api';
import { TodoistTransformer } from './transformer';
import { ITodoistCollaborator, ITodoistItem } from './types';

export class TodoistService implements IMerjoonServiceBase {
  static mapIds(items: ITodoistItem[]) {
    return items.map((item: ITodoistItem) => item.id);
  }

  protected projectIds?: string[];

  constructor(
    public readonly api: TodoistApi,
    public readonly transformer: TodoistTransformer,
  ) {}

  static removeCollaboratorDuplicates(allCollaborators: ITodoistCollaborator[]) {
    const collaboratorsMap = new Map(
      allCollaborators.map((collaborator) => [collaborator.id, collaborator]),
    );
    return Array.from(collaboratorsMap.values());
  }

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    this.projectIds = TodoistService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }

  protected async fetchAllProjectCollaborators() {
    if (!this.projectIds) {
      throw new Error('Missing ProjectIds');
    }

    const collaboratorsByProject = await Promise.all(
      this.projectIds.map((projectId) => this.api.getAllCollaborators(projectId)),
    );
    const allCollaborators = collaboratorsByProject.flat();
    return TodoistService.removeCollaboratorDuplicates(allCollaborators);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.fetchAllProjectCollaborators();
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    const sections = await this.api.getAllSections();

    const sectionMap = new Map(sections.map((section) => [section.id, section]));

    tasks.forEach((task) => {
      if (task.section_id) {
        task.section = sectionMap.get(task.section_id);
      }
    });
    return this.transformer.transformTasks(tasks);
  }
}
