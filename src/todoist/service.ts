import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TodoistApi } from './api';
import { TodoistTransformer } from './transformer';

export class TodoistService implements IMerjoonService {
  protected projectIds?: string[];

  constructor(
    public readonly api: TodoistApi,
    public readonly transformer: TodoistTransformer,
  ) {}

  public async init() {
    const projects = await this.api.getAllProjects();
    this.projectIds = projects.map((project) => project.id);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }

  protected async fetchAllProjectCollaborators() {
    if (!this.projectIds) {
      throw new Error('Project IDs must be initialized');
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

    const sectionMap = new Map<string, string>();
    sections.forEach((section) => {
      sectionMap.set(section.id, section.name);
    });

    const enhancedTasks = tasks.map((task) => {
      let name: string | undefined;
      if (task.section_id) {
        name = sectionMap.get(task.section_id);
      }
      return {
        ...task,
        section: {
          name,
        },
      };
    });
    return this.transformer.transformTasks(enhancedTasks);
  }
}
