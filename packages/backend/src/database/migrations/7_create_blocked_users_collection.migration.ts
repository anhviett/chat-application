import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateBlockedUsersCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create blockedUsers collection');

    await db.createCollection('blockedUsers', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'blockedUserId'],
          properties: {
            _id: { bsonType: 'objectId' },
            user_id: {
              bsonType: 'objectId',
              description: 'User ID who blocked another user',
            },
            blockedUser_id: {
              bsonType: 'objectId',
              description: 'User ID of the blocked user',
            },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('blockedUsers');
    await collection.createIndex({ user_id: 1 });
    await collection.createIndex({ blockedUser_id: 1 });
    await collection.createIndex({ user_id: 1, blockedUser_id: 1 }, { unique: true });
    await collection.createIndex({ createdAt: -1 });

    console.log('✅ Created blockedUsers collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: blockedUsers collection');
    await db.collection('blockedUsers').drop();
    console.log('✅ Dropped blockedUsers collection');
  }
}
