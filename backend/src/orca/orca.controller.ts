import { Controller, Get,Post, Body } from '@nestjs/common';
import { OrcaService } from './orca.service.js';

@Controller('api/ai')
export class OrcaController {
    constructor(private readonly orcaService: OrcaService) { }

    @Get('models')
    async getModels() {
        return this.orcaService.getModelsAndLog();
    }

    @Post('chat')
    async chatWithAi(@Body() body: { model: string; prompt: string }) {
        return this.orcaService.sendChatPrompt(body);
    }
}