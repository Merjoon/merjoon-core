import { HiveTransformer} from "./hive/transformer";
import { HiveService } from './hive/service';
import { IHiveConfig } from './hive/types';
import { HiveApi } from './hive/api';
import fs from 'fs';


let service: HiveService;

const config: IHiveConfig = {
    api_key: 'a6bb1e8dd8eac8c2e2580d6d78b21714',
    user_id: 'YKPJjiHNzqMQ3MgFc',
    workspace_id: 'G4yvRthaN2Pr3kknK',
};

const api: HiveApi = new HiveApi(config);
const transformer: HiveTransformer = new HiveTransformer();
service = new HiveService(api, transformer)

async function main() {
    try {
        const users = await service.getUsers();
        const projects = await service.getProjects();
        const tasks = await service.getTasks();

        try {
            fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {});
            fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {});
            fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {});
            console.log('successfully written');
        } catch(error) {
            console.log(error);
        }
    } catch (error) {
        console.error(error);
    }
}

main();