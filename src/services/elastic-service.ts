import { ElasticClient } from "../config/elastic"
import logger from "../utils/logger";


export const searchTask = async (data: any, id: any) => {
    const findTask = await ElasticClient.search({
        index: 'task',
        query: {
            bool: {
                must: [{
                    multi_match: {
                        query: data,
                        fields: ['title', 'description', 'status'],
                        fuzziness: 'AUTO'
                    }
                }],
                filter: [{
                    term: {
                        forUser: id.toString()
                    }
                }]
            }
        }
    })
    const tasks = findTask.hits.hits.map((hit: any) => hit._source);

    logger.info(`user with id: ${id} searched: {${data}}`)

    return tasks
}