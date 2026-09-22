import { OrcaService } from './orca.service.js';
export declare class OrcaController {
    private readonly orcaService;
    constructor(orcaService: OrcaService);
    getModels(): Promise<any>;
    chatWithAi(body: {
        model: string;
        prompt: string;
    }): Promise<any>;
}
