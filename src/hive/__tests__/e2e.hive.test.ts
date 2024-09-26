import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { HiveTransformer } from '../transformer';
import { HiveService } from '../service';
import { IHiveConfig } from '../types';
import { HiveApi } from '../api';
import { ID_REGEX } from "../../utils/regex";

describe('e2e Hive', () => {
    let service: HiveService;

    beforeEach(() => {
        const {
            HIVE_API_KEY,
            HIVE_USER_ID,
            HIVE_WORKSPACE_ID,
        } = process.env;

        const config: IHiveConfig = {
            api_key: HIVE_API_KEY!,
            user_id: HIVE_USER_ID!,
            workspace_id: HIVE_WORKSPACE_ID!,
        };

        const api: HiveApi = new HiveApi(config);
        const transformer: HiveTransformer = new HiveTransformer();
        service = new HiveService(api, transformer);
    });

    it('getUsers', async () => {
        const users: IMerjoonUsers = await service.getUsers();

        expect(Object.keys(users[0])).toEqual(expect.arrayContaining([
            'id',
            'remote_id',
            'name',
            'email_address',
            'created_at',
            'modified_at',
        ]));

        expect(users[0]).toEqual({
            id: expect.stringMatching(ID_REGEX),
            remote_id: expect.any(String),
            name: expect.any(String),
            email_address: expect.any(String),
            created_at: expect.any(Number),
            modified_at: expect.any(Number),
        });
    });

    it('getProjects', async () => {
        const projects: IMerjoonProjects = await service.getProjects();

        expect(Object.keys(projects[0])).toEqual(expect.arrayContaining([
            'id',
            'remote_id',
            'name',
            'description',
            'remote_created_at',
            'remote_modified_at',
            'created_at',
            'modified_at',
        ]));

        expect(projects[0]).toEqual({
            id: expect.stringMatching(ID_REGEX),
            remote_id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            remote_created_at: expect.any(String),
            remote_modified_at: expect.any(String),
            created_at: expect.any(Number),
            modified_at: expect.any(Number),
        });
    });

    it('getTasks', async () => {
        const tasks: IMerjoonTasks = await service.getTasks();

        expect(Object.keys(tasks[0])).toEqual(expect.arrayContaining([
            'id',
            'remote_id',
            'name',
            'assignees',
            'status',
            'description',
            'projects',
            'remote_created_at',
            'remote_updated_at',
            'created_at',
            'modified_at',
        ]));

        expect(tasks[0]).toEqual({
            id: expect.stringMatching(ID_REGEX),
            remote_id: expect.any(String),
            name: expect.any(String),
            assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
            status: expect.any(String),
            description: expect.any(String),
            projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
            remote_created_at: expect.any(String),
            remote_updated_at: expect.any(String),
            created_at: expect.any(Number),
            modified_at: expect.any(Number),
        });
    });
})
