import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateConversationsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create conversations collection');

    await db.createCollection('conversations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['type', 'participants'],
          properties: {
            _id: { bsonType: 'objectId' },
            type: {
              enum: ['direct', 'group', 'channel'],
              description: 'Type of conversation (direct message, group, or channel)',
            },
            participants: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
              description: 'Array of user IDs participating in conversation',
            },
            createdBy: {
              bsonType: 'objectId',
              description: 'User ID who created the conversation',
            },
            name: {
              bsonType: 'string',
              description: 'Conversation name (for groups and channels)',
            },
            avatar: {
              bsonType: 'string',
              description: 'Avatar image URL',
            },
            description: {
              bsonType: 'string',
              description: 'Description of the conversation',
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('conversations');
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ createdBy: 1 });
    await collection.createIndex({ createdAt: -1 });

    // Get sample user IDs for seeding (if users exist)
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().limit(3).toArray();

    if (users.length >= 2) {
      // Seed sample conversations
      const conversations: any[] = [
        {
          type: 'direct',
          participants: [users[0].id, users[1].id],
          createdBy: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      if (users.length >= 3) {
        conversations.push({
          type: 'group',
          name: 'Development Team',
          description: 'Group for development team discussions',
          avatar: 'https://example.com/avatar.jpg',
          participants: [users[0].id, users[1].id, users[2].id],
          createdBy: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await collection.insertMany(conversations);
    }

    console.log('✅ Created conversations collection with sample data');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: conversations collection');
    await db.collection('conversations').drop();
    console.log('✅ Dropped conversations collection');
  }
}
