import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateMessageStatusCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create messageStatus collection');

    await db.createCollection('messageStatus', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['messageId', 'receiverId', 'status'],
          properties: {
            _id: { bsonType: 'objectId' },
            messageId: {
              bsonType: 'objectId',
              description: 'Reference to message',
            },
            receiverId: {
              bsonType: 'objectId',
              description: 'User ID of message receiver',
            },
            status: {
              bsonType: 'string',
              enum: ['sent', 'delivered', 'read'],
              description: 'Message delivery status',
            },
            updatedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('messageStatus');
    await collection.createIndex({ messageId: 1 });
    await collection.createIndex({ receiverId: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ updatedAt: -1 });

    console.log('✅ Created messageStatus collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: messageStatus collection');
    await db.collection('messageStatus').drop();
    console.log('✅ Dropped messageStatus collection');
  }
}
