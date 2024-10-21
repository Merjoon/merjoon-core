import {ClickUpApi} from "./api";
import {ClickUpTransformer} from "./transformer";
import {ClickUpService} from "./service";

export function getClickUpService(): ClickUpService {
    const {
        CLICKUP_API_KEY,
    } = process.env;

    if (!CLICKUP_API_KEY) {
        throw new Error('Missing necessary environment variables');
    }

    const config = {
        apiKey: CLICKUP_API_KEY,
    };

    const api: ClickUpApi = new ClickUpApi(config);
    const transformer: ClickUpTransformer = new ClickUpTransformer();
    return new ClickUpService(api, transformer);
}