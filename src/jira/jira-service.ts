
import { JiraApi } from "./api";
import { JiraService } from "./service";
import { JiraTransformer } from "./transformer";
import { IJiraConfig } from "./types";

// TODO: add eslint config
// TODO: run eslint

export function getJiraService (): JiraService {
    const {
    JIRA_TOKEN,
    JIRA_SUBDOMAIN,
    JIRA_EMAIL,
    JIRA_LIMIT
    } = process.env;
    
    if (!JIRA_TOKEN || !JIRA_SUBDOMAIN || !JIRA_EMAIL) {
        throw new Error('Missing necessary environment variables');
    }

    const config: IJiraConfig = {
        token: JIRA_TOKEN,
        subdomain: JIRA_SUBDOMAIN,
        email: JIRA_EMAIL,
        pageSize: Number(JIRA_LIMIT) || 50
    };

    const api: JiraApi = new JiraApi(config)
    const transformer: JiraTransformer = new JiraTransformer()
    return new JiraService(api, transformer)
}


