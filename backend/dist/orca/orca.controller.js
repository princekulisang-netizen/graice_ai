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
import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrcaService } from './orca.service.js';
let OrcaController = class OrcaController {
    orcaService;
    constructor(orcaService) {
        this.orcaService = orcaService;
    }
    async getModels() {
        return this.orcaService.getModelsAndLog();
    }
    async chatWithAi(body) {
        return this.orcaService.sendChatPrompt(body);
    }
};
__decorate([
    Get('models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrcaController.prototype, "getModels", null);
__decorate([
    Post('chat'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrcaController.prototype, "chatWithAi", null);
OrcaController = __decorate([
    Controller('api/ai'),
    __metadata("design:paramtypes", [OrcaService])
], OrcaController);
export { OrcaController };
//# sourceMappingURL=orca.controller.js.map