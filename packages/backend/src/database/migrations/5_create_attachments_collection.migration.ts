import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateAttachmentsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create attachments collection');

    await db.createCollection('attachments', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['sender', 'conversationId'],
          properties: {
            _id: { bsonType: 'objectId' },
            message_id: {
              bsonType: 'int',
              description: 'ID of the message this attachment belongs to',
            },
            fileUrl: {
              bsonType: 'string',
              description: 'URL of the attachment file',
            },
            fileType: {
              bsonType: 'string',
              description: 'Type of the attachment file',
            },
            fileSize: {
              bsonType: 'string',
              description: 'Size of the attachment file',
            },
            uploadedAt: {
              bsonType: 'date',
              description: 'Timestamp when the attachment was uploaded',
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    const collection = db.collection('messages');
    await collection.createIndex({ sender: 1 });
    await collection.createIndex({ conversation_id: 1 });
    await collection.createIndex({ conversation_id: 1, createdAt: -1 });
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
          sender: users[0].id,
          conversation_id: conversations[0].id,
          content: 'Hey! How are you doing?',
          type: 'text',
          status: 'read',
          readBy: [
            { user_id: users[1].id, readAt: new Date(Date.now() - 1800000) },
          ],
          attachments: [],
          isDeleted: false,
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000),
        },
        {
          sender: users[1].id,
          conversation_id: conversations[0].id,
          content: 'I\'m doing great! Just finished the project.',
          type: 'text',
          status: 'read',
          readBy: [
            { user_id: users[0].id, readAt: new Date(Date.now() - 1800000) },
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
            sender: users[0].id,
            conversation_id: conversations[1].id,
            content: 'Team, let\'s sync up on the new features',
            type: 'text',
            status: 'delivered',
            readBy: [
              { user_id: users[1].id, readAt: new Date(Date.now() - 1200000) },
            ],
            attachments: [],
            isDeleted: false,
            createdAt: new Date(Date.now() - 1800000),
            updatedAt: new Date(Date.now() - 1800000),
          },
          {
            sender: users[1].id,
            conversation_id: conversations[1].id,
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
