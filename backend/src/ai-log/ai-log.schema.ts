import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AiLog extends Document {
    @Prop({ required: true })
    modelId: string;

    @Prop({ required: true })
    status: string;

    @Prop({ type: Object })
    responsePayload: Record<string, any>;
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog);