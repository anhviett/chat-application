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
            lastMessage: {
              bsonType: 'objectId',
              description: 'Reference to the last message',
            },
            lastMessageAt: {
              bsonType: 'date',
              description: 'Timestamp of the last message',
            },
            participantMetadata: {
              bsonType: 'object',
              description:
                'Per-user metadata (unread count, last read time, mute status)',
            },
            admins: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
              description: 'Array of admin user IDs',
            },
            isArchived: {
              bsonType: 'bool',
              description: 'Whether conversation is archived',
            },
            settings: {
              bsonType: 'object',
              description: 'Conversation settings and permissions',
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('conversations');
    await collection.createIndex({ participants: 1 });
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ lastMessageAt: -1 });
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
          participants: [users[0]._id, users[1]._id],
          createdBy: users[0]._id,
          lastMessageAt: new Date(),
          participantMetadata: {
            [users[0]._id.toString()]: {
              unreadCount: 0,
              lastReadAt: new Date(),
            },
            [users[1]._id.toString()]: {
              unreadCount: 2,
              lastReadAt: new Date(Date.now() - 3600000),
            },
          },
          isArchived: false,
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
          participants: [users[0]._id, users[1]._id, users[2]._id],
          createdBy: users[0]._id,
          lastMessageAt: new Date(),
          participantMetadata: {
            [users[0]._id.toString()]: {
              unreadCount: 0,
              lastReadAt: new Date(),
            },
            [users[1]._id.toString()]: {
              unreadCount: 1,
              lastReadAt: new Date(Date.now() - 1800000),
            },
            [users[2]._id.toString()]: {
              unreadCount: 3,
              lastReadAt: new Date(Date.now() - 7200000),
            },
          },
          admins: [users[0]._id],
          isArchived: false,
          settings: {
            allowMemberToInvite: true,
            allowMemberToSendMedia: true,
            requireApprovalToJoin: false,
          },
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
