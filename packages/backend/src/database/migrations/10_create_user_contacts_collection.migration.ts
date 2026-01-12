import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateUserContactsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create userContacts collection');

    await db.createCollection('userContacts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'friendId'],
          properties: {
            _id: { bsonType: 'objectId' },
            userId: {
              bsonType: 'objectId',
              description: 'User ID who has the contact',
            },
            friendId: {
              bsonType: 'objectId',
              description: 'Contact user ID (friend)',
            },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('userContacts');
    await collection.createIndex({ userId: 1 });
    await collection.createIndex({ friendId: 1 });
    await collection.createIndex({ userId: 1, friendId: 1 }, { unique: true });
    await collection.createIndex({ createdAt: -1 });

    console.log('✅ Created userContacts collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: userContacts collection');
    await db.collection('userContacts').drop();
    console.log('✅ Dropped userContacts collection');
  }
}
