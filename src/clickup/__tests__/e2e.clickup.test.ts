import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { ClickUpService } from '../service';
import { getClickUpService } from "../clickup-service";
import { ID_REGEX } from "../../utils/regex";

describe('e2e ClickUp', () => {
    let service: ClickUpService;

    beforeEach(() => {
        service = getClickUpService();
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
            'created_at',
            'modified_at',
        ]));

        expect(projects[0]).toEqual({
            id: expect.stringMatching(ID_REGEX),
            remote_id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
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
            'remote_modified_at',
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
            projects: expect.arrayContaining(tasks[0].projects.length === 0 ? [] : [expect.stringMatching(ID_REGEX)]),
            remote_created_at: expect.any(String),
            remote_modified_at: expect.any(String),
            created_at: expect.any(Number),
            modified_at: expect.any(Number),
        });
    });
})