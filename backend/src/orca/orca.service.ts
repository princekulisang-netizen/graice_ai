import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiLog } from '../ai-log/ai-log.schema.js';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrcaService {
    private readonly orcaBaseUrl = 'https://api.orcarouter.ai/v1';
    private readonly apiKey = process.env.ORCA_API_KEY;

    constructor(
        private readonly httpService: HttpService,
        @InjectModel(AiLog.name) private readonly aiLogModel: Model<AiLog>,
    ) { }

    async getModelsAndLog() {
        try {
            const url = `${this.orcaBaseUrl}/models`;

            // Menggunakan HttpService NestJS dengan firstValueFrom
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`
                    }
                })
            );

            // 1. Simpan log sukses ke MongoDB terlebih dahulu
            await this.aiLogModel.create({
                modelId: 'orca-models-fetch',
                status: 'SUCCESS',
                responsePayload: response.data,
            });

            // 2. Kembalikan data ke controller
            return response.data;

        } catch (error: any) {
            // Catat kegagalan ke MongoDB dengan aman
            await this.aiLogModel.create({
                modelId: 'orca-models-fetch',
                status: 'FAILED',
                responsePayload: { error: error.message || 'Unknown error' },
            });
            throw error;
        }
    }


    async sendChatPrompt(promptData: { model: string; prompt: string }) {
        try {
            const url = `${this.orcaBaseUrl}/chat/completions`; // Sesuaikan endpoint chat OrcaRouter
            const response = await firstValueFrom(
                this.httpService.post(
                    url,
                    {
                        model: promptData.model,
                        messages: [{ role: 'user', content: promptData.prompt }],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            // Simpan log chat sukses ke MongoDB
            await this.aiLogModel.create({
                modelId: promptData.model,
                status: 'CHAT_SUCCESS',
                responsePayload: response.data,
            });

            return response.data;
        } catch (error: any) {
            await this.aiLogModel.create({
                modelId: promptData.model,
                status: 'CHAT_FAILED',
                responsePayload: { error: error.message || 'Unknown error' },
            });
            throw error;
        }
    }
}