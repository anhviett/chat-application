import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chats/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SocketGateway } from './socket/socket.gateway';

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
    ChatModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
