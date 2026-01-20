import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateParticipantsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create participants collection');

    await db.createCollection('participants', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['conversationId', 'userId'],
          properties: {
            _id: { bsonType: 'objectId' },
            conversation_id: {
              bsonType: 'objectId',
              description: 'Reference to the conversation',
            },
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to the user',
            },
            joinedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('participants');
    await collection.createIndex({ conversation_id: 1 });
    await collection.createIndex({ user_id: 1 });
    await collection.createIndex({ conversation_id: 1, user_id: 1 }, { unique: true });
    await collection.createIndex({ joinedAt: -1 });

    console.log('✅ Created participants collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: participants collection');
    await db.collection('participants').drop();
    console.log('✅ Dropped participants collection');
  }
}