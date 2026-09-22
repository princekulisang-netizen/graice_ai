export interface AIModel {
    id: string;
    object: string;
    created?: number;
    owned_by?: string;
    supported_endpoint_types?: string[];
}

export interface AIModelResponse {
    data: AIModel[];
}