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

    // No seeding for attachments collection to avoid schema validation errors
    console.log('✅ Created attachments collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: messages collection');
    await db.collection('messages').drop();
    console.log('✅ Dropped messages collection');
  }
}
