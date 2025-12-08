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
              description: 'Reference to the conversation',
            },
            content: {
              bsonType: 'string',
              description: 'Message content/text',
            },
            type: {
              enum: ['text', 'image', 'file', 'audio', 'video'],
              description: 'Type of message content',
            },
            status: {
              enum: ['sent', 'delivered', 'read'],
              description: 'Delivery and read status',
            },
            readBy: {
              bsonType: 'array',
              description: 'Array of users who have read the message',
            },
            replyTo: {
              bsonType: 'objectId',
              description: 'Reference to replied message (if any)',
            },
            attachments: {
              bsonType: 'array',
              items: { bsonType: 'string' },
              description: 'Array of attachment file URLs',
            },
            isDeleted: {
              bsonType: 'bool',
              description: 'Whether message is deleted',
            },
            deletedAt: {
              bsonType: 'date',
              description: 'Timestamp when message was deleted',
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

    // Get sample data for seeding
    const conversationsCollection = db.collection('conversations');
    const usersCollection = db.collection('users');
    const conversations = await conversationsCollection.find().toArray();
    const users = await usersCollection.find().toArray();

    if (conversations.length > 0 && users.length >= 2) {
      // Seed sample messages
      const messages = [
        {
          sender: users[0]._id,
          conversationId: conversations[0]._id,
          content: 'Hey! How are you doing?',
          type: 'text',
          status: 'read',
          readBy: [
            { userId: users[1]._id, readAt: new Date(Date.now() - 1800000) },
          ],
          attachments: [],
          isDeleted: false,
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000),
        },
        {
          sender: users[1]._id,
          conversationId: conversations[0]._id,
          content: 'I\'m doing great! Just finished the project.',
          type: 'text',
          status: 'read',
          readBy: [
            { userId: users[0]._id, readAt: new Date(Date.now() - 1800000) },
          ],
          attachments: [],
          isDeleted: false,
          createdAt: new Date(Date.now() - 3000000),
          updatedAt: new Date(Date.now() - 3000000),
        },
      ];

      if (conversations.length > 1) {
        messages.push(
          {
            sender: users[0]._id,
            conversationId: conversations[1]._id,
            content: 'Team, let\'s sync up on the new features',
            type: 'text',
            status: 'delivered',
            readBy: [
              { userId: users[1]._id, readAt: new Date(Date.now() - 1200000) },
            ],
            attachments: [],
            isDeleted: false,
            createdAt: new Date(Date.now() - 1800000),
            updatedAt: new Date(Date.now() - 1800000),
          },
          {
            sender: users[1]._id,
            conversationId: conversations[1]._id,
            content: 'Sounds good! I\'ll prepare the documentation.',
            type: 'text',
            status: 'sent',
            readBy: [],
            attachments: [],
            isDeleted: false,
            createdAt: new Date(Date.now() - 1200000),
            updatedAt: new Date(Date.now() - 1200000),
          }
        );
      }

      await collection.insertMany(messages);
    }

    console.log('✅ Created messages collection with sample data');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: messages collection');
    await db.collection('messages').drop();
    console.log('✅ Dropped messages collection');
  }
}
