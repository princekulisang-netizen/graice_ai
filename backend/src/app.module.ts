import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OrcaController } from './orca/orca.controller.js';
import { OrcaService } from './orca/orca.service.js';
import { AiLog, AiLogSchema } from './ai-log/ai-log.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/graice_ai'),
    MongooseModule.forFeature([{ name: AiLog.name, schema: AiLogSchema }]),
    HttpModule,
  ],
  controllers: [AppController, OrcaController],
  providers: [AppService, OrcaService],
})
export class AppModule {}