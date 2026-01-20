import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateNotificationsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create notifications collection');

    await db.createCollection('notifications', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId'],
          properties: {
            _id: { bsonType: 'objectId' },
            user_id: {
              bsonType: 'objectId',
              description: 'User ID who receives the notification',
            },
            type: {
              bsonType: 'string',
              enum: ['message', 'friend_request', 'group_invite', 'mention'],
              description: 'Notification type',
            },
            content: {
              bsonType: 'string',
              description: 'Notification message content',
            },
            createdAt: { bsonType: 'date' },
            isSeen: {
              bsonType: 'bool',
              description: 'Whether notification has been seen',
            },
          },
        },
      },
    });

    const collection = db.collection('notifications');
    await collection.createIndex({ user_id: 1 });
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ isSeen: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ user_id: 1, createdAt: -1 });

    console.log('✅ Created notifications collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: notifications collection');
    await db.collection('notifications').drop();
    console.log('✅ Dropped notifications collection');
  }
}
