var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiLog } from '../ai-log/ai-log.schema.js';
import { firstValueFrom } from 'rxjs';
let OrcaService = class OrcaService {
    httpService;
    aiLogModel;
    orcaBaseUrl = 'https://api.orcarouter.ai/v1';
    apiKey = process.env.ORCA_API_KEY;
    constructor(httpService, aiLogModel) {
        this.httpService = httpService;
        this.aiLogModel = aiLogModel;
    }
    async getModelsAndLog() {
        try {
            const url = `${this.orcaBaseUrl}/models`;
            const response = await firstValueFrom(this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            }));
            await this.aiLogModel.create({
                modelId: 'orca-models-fetch',
                status: 'SUCCESS',
                responsePayload: response.data,
            });
            return response.data;
        }
        catch (error) {
            await this.aiLogModel.create({
                modelId: 'orca-models-fetch',
                status: 'FAILED',
                responsePayload: { error: error.message || 'Unknown error' },
            });
            throw error;
        }
    }
    async sendChatPrompt(promptData) {
        try {
            const url = `${this.orcaBaseUrl}/chat/completions`;
            const response = await firstValueFrom(this.httpService.post(url, {
                model: promptData.model,
                messages: [{ role: 'user', content: promptData.prompt }],
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }));
            await this.aiLogModel.create({
                modelId: promptData.model,
                status: 'CHAT_SUCCESS',
                responsePayload: response.data,
            });
            return response.data;
        }
        catch (error) {
            await this.aiLogModel.create({
                modelId: promptData.model,
                status: 'CHAT_FAILED',
                responsePayload: { error: error.message || 'Unknown error' },
            });
            throw error;
        }
    }
};
OrcaService = __decorate([
    Injectable(),
    __param(1, InjectModel(AiLog.name)),
    __metadata("design:paramtypes", [HttpService,
        Model])
], OrcaService);
export { OrcaService };
//# sourceMappingURL=orca.service.js.map