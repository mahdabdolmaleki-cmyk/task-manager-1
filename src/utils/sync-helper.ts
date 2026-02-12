import { ElasticClient } from "../config/elastic";
import { TaskModel } from "../model/task-model";

export async function simpleSyncOnStart() {

    try {
        await ElasticClient.deleteByQuery({
            index: 'task',
            body: {
                query: { match_all: {} }
            }
        });
        console.log('Old elastic data deleted');
    } catch (error) {
        console.log('cant delete old elastic data');
    }

    console.log('Syncing all tasks to Elasticsearch...');
    const tasks = await TaskModel.find({});

    for (const task of tasks) {
        try {
            await ElasticClient.index({
                index: 'task',
                id: task._id.toString(),
                document: {
                    userCreatore: task.userCreatore.toString(),
                    forUser: task.forUser.toString(),
                    title: task.title,
                    description: task.description || '',
                    status: task.status,
                    urgent: task.urgent
                }
            });
        } catch (error) {
            console.error(`Failed to add task ${task._id}:`, error);
        }
    }

    console.log(`synced all task`);
}