import { Document } from 'mongoose';
export declare class AiLog extends Document {
    modelId: string;
    status: string;
    responsePayload: Record<string, any>;
}
export declare const AiLogSchema: import("mongoose").Schema<AiLog, import("mongoose").Model<AiLog, any, any, any, any, any, AiLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AiLog, Document<unknown, {}, AiLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AiLog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, AiLog, Document<unknown, {}, AiLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    modelId?: import("mongoose").SchemaDefinitionProperty<string, AiLog, Document<unknown, {}, AiLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, AiLog, Document<unknown, {}, AiLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    responsePayload?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, AiLog, Document<unknown, {}, AiLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AiLog>;
