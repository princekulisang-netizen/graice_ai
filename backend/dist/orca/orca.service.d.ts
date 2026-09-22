import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { AiLog } from '../ai-log/ai-log.schema.js';
export declare class OrcaService {
    private readonly httpService;
    private readonly aiLogModel;
    private readonly orcaBaseUrl;
    private readonly apiKey;
    constructor(httpService: HttpService, aiLogModel: Model<AiLog>);
    getModelsAndLog(): Promise<any>;
    sendChatPrompt(promptData: {
        model: string;
        prompt: string;
    }): Promise<any>;
}
