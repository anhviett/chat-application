import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chats/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SocketGateway } from './socket/socket.gateway';
import { GeminiController } from './gemini/gemini.controller';
import { GeminiService } from './gemini/gemini.service';
import { GeminiModule } from './gemini/gemini.module';

dotenv.config();

const mongoUri =
  process.env.DATABASE_URL ||
  `${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}`;

console.log(
  'MongoDB connected:',
  mongoUri.replace(/:[^@]*@/, ':****@').substring(0, 80) + '...'
);

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    AuthModule,
    ChatModule,
    UsersModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
