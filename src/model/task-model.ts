import { Schema, model, Document, Types } from 'mongoose';
import { ElasticClient } from '../config/elastic';

interface ITask extends Document {
    userCreatore: Types.ObjectId;
    forUser: Types.ObjectId;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    urgent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    userCreatore: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    forUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed'], 
        default: 'pending'
    },
    urgent: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

taskSchema.post('save', async function(doc: ITask) {
    console.log(`Post-save middleware triggered for task: ${doc._id}`);
    
    try {
        await ElasticClient.index({
            index: 'task',
            id: doc._id.toString(),
            document: {
                userCreatore: doc.userCreatore.toString(),
                forUser: doc.forUser.toString(),
                title: doc.title,
                description: doc.description,
                status: doc.status,
                urgent: doc.urgent,
                _syncedFrom: 'mongoose_middleware'
            }
        });
        console.log(`✅ Task ${doc._id} synced to Elasticsearch (SAVE)`);
    } catch (error: any) {
        console.error(`Failed to sync task ${doc._id} to Elasticsearch:`, error.message);
    }
});

taskSchema.post('findOneAndUpdate', async function(doc: ITask | null) {
    if (!doc) {
        return;
    }
    console.log(`Post-findOneAndUpdate middleware triggered for task: ${doc._id}`);
    
    try {
        try {
            await ElasticClient.get({
                index: 'task',
                id: doc._id.toString()
            });
            
            await ElasticClient.update({
                index: 'task',
                id: doc._id.toString(),
                doc: {
                    userCreatore: doc.userCreatore.toString(),
                    forUser: doc.forUser.toString(),
                    title: doc.title,
                    description: doc.description,
                    status: doc.status,
                    urgent: doc.urgent,
                    updatedAt: doc.updatedAt
                }
            });
            
            console.log(`✅ Task ${doc._id} updated in Elasticsearch`);
            
        } catch (getError: any) {
            if (getError.meta?.statusCode === 404) {

                console.log(`Task ${doc._id} not found in Elasticsearch, creating...`);
                
                await ElasticClient.index({
                    index: 'task',
                    id: doc._id.toString(),
                    document: {
                        userCreatore: doc.userCreatore.toString(),
                        forUser: doc.forUser.toString(),
                        title: doc.title,
                        description: doc.description,
                        status: doc.status,
                        urgent: doc.urgent,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        _syncedFrom: 'mongoose_middleware_update'
                    }
                });
            } else {
                throw getError;
            }
        }
        
    } catch (error: any) {
        console.error(`Failed to update task ${doc._id} in Elasticsearch:`, error.message);
    }
});

taskSchema.post('findOneAndDelete', async function(doc: ITask | null) {
    if (!doc) return;
    console.log(`🗑️ Post-findOneAndDelete middleware triggered for task: ${doc._id}`);
    try {
        await ElasticClient.delete({
            index: 'task',
            id: doc._id.toString()
        });
        
        console.log(`Task ${doc._id} deleted from Elasticsearch`);
        
    } catch (error: any) {
        if (error.meta?.statusCode !== 404) {
            console.error(`Failed to delete task ${doc._id} from Elasticsearch:`, error.message);
        } else {
            console.log(`ℹTask ${doc._id} was already deleted from Elasticsearch`);
        }
    }
});

export const TaskModel = model<ITask>('Task', taskSchema);