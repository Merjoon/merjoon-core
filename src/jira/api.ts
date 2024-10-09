import { HttpClient } from "../common/HttpClient";
import { IJiraConfig, IJiraQueryParams, JiraApiPath } from "./types";
export class JiraApi extends HttpClient {

    protected readonly encodedCredentials: string;

    constructor (config: IJiraConfig) {
        const basePath = `https://${config.subdomain}/rest/api/3`
        super(basePath)
        this.encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64')
    }

    public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
        const config = {
          headers: {
            'Authorization': `Basic ${this.encodedCredentials}`
          }
        }
    
        const response = await this.get({
          path,
          config
        })
        
        return response
      }
}