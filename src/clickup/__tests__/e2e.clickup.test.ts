import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { ClickUpService } from '../service';
import { getClickUpService } from "../clickup-service";
import { ID_REGEX } from "../../utils/regex";

describe('e2e ClickUp', () => {
    let service: ClickUpService;
    beforeEach(() => {
        service = getClickUpService();
    });

    describe('getUsers', () =>  {
        
        it('getUsers succeeded', async () => {
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
    });

    describe('getProjects', () => {
        it('getProjects succeeded', async () => {
            await service.getUsers();
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
        }, 70000);

        it('getProjects failed with "Team IDs not found" error', async () => {
            expect(async () => await service.getProjects()).toThrow('Team IDs not found');
        });
        
    })

    describe('getTasks', async () => {
        it('getTasks succeeded', async () => {
            await service.getUsers();
            await service.getProjects();
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
        }, 70000);

        it('getTasks failed with "List IDs not found" error', async () => {
            expect(async () => await service.getTasks()).toThrow('List IDs not found');
        });

        it('getTasks failed with "List IDs not found" error', async () => {
            await service.getUsers()
            expect(async () => await service.getTasks()).toThrow('List IDs not found');
        });
    })
    
})