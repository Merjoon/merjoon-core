import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TodoistApi } from './api';
import { TodoistTransformer } from './transformer';
import { ITodoistItem, ITodoistSection } from './types';

export class TodoistService implements IMerjoonService {
  protected projectIds?: string[];

  constructor(
    public readonly api: TodoistApi,
    public readonly transformer: TodoistTransformer,
  ) {}

  static mapIds(items: ITodoistItem[]) {
    return items.map((item: ITodoistItem) => item.id);
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

    const collaboratorsMap = new Map(
      allCollaborators.map((collaborator) => [collaborator.id, collaborator]),
    );
    return Array.from(collaboratorsMap.values());
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.fetchAllProjectCollaborators();
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    const sections = await this.api.getAllSections();

    const sectionMap = new Map<string, ITodoistSection>();
    sections.forEach((section) => {
      sectionMap.set(section.id, section);
    });

    const enhancedTasks = tasks.map((task) => {
      let section;
      if (task.section_id) {
        section = sectionMap.get(task.section_id);
      }
      return {
        ...task,
        section,
      };
    });
    return this.transformer.transformTasks(enhancedTasks);
  }
}
