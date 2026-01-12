import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateGroupSettingsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create groupSettings collection');

    await db.createCollection('groupSettings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['conversationId'],
          properties: {
            _id: { bsonType: 'objectId' },
            conversationId: {
              bsonType: 'objectId',
              description: 'Reference to conversation/group',
            },
            settingName: {
              bsonType: 'string',
              description: 'Name of the setting',
            },
            settingValue: {
              bsonType: ['string', 'bool', 'int'],
              description: 'Value of the setting',
            },
            updatedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('groupSettings');
    await collection.createIndex({ conversationId: 1 });
    await collection.createIndex({ settingName: 1 });
    await collection.createIndex({ conversationId: 1, settingName: 1 }, { unique: true });
    await collection.createIndex({ updatedAt: -1 });

    console.log('✅ Created groupSettings collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: groupSettings collection');
    await db.collection('groupSettings').drop();
    console.log('✅ Dropped groupSettings collection');
  }
}
