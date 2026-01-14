import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateMessagesCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create messages collection');

    await db.createCollection('messages', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['sender', 'conversationId', 'content'],
          properties: {
            _id: { bsonType: 'objectId' },
            sender: {
              bsonType: 'objectId',
              description: 'User ID of message sender',
            },
            conversationId: {
              bsonType: 'objectId',
              description: 'Reference to conversation',
            },
            content: {
              bsonType: 'string',
              description: 'Message content',
            },
            type: {
              bsonType: 'string',
              enum: ['text', 'image', 'file', 'audio', 'video'],
              description: 'Message type',
            },
            status: {
              bsonType: 'string',
              enum: ['sent', 'delivered', 'read'],
              description: 'Message status',
            },
            readBy: {
              bsonType: 'array',
              description: 'Users who read this message',
            },
            attachments: {
              bsonType: 'array',
              items: { bsonType: 'string' },
              description: 'Attachment URLs',
            },
            isDeleted: {
              bsonType: 'bool',
              description: 'Is message deleted',
            },
            deletedAt: {
              bsonType: 'date',
              description: 'Deletion timestamp',
            },
            metadata: {
              bsonType: 'object',
              additionalProperties: true,
              description: 'Additional metadata',
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('messages');
    await collection.createIndex({ sender: 1 });
    await collection.createIndex({ conversationId: 1 });
    await collection.createIndex({ conversationId: 1, createdAt: -1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ status: 1 });

    console.log('✅ Created messages collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: messages collection');
    await db.collection('messages').drop();
    console.log('✅ Dropped messages collection');
  }
}
