import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateUsersCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create users collection');

    // Create collection with schema validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password'],
          properties: {
            _id: { bsonType: 'objectId' },
            firstName: {
              bsonType: 'string',
              description: 'User first name',
            },
            lastName: {
              bsonType: 'string',
              description: 'User last name',
            },
            email: {
              bsonType: 'string',
              description: 'Unique email address',
            },
            password: {
              bsonType: 'string',
              description: 'Hashed password',
            },
            about: {
              bsonType: 'string',
              description: 'User bio or about section',
            },
            birthday: {
              bsonType: 'date',
              description: 'User date of birth',
            },
            height: {
              bsonType: 'number',
              description: 'User height in cm',
            },
            weight: {
              bsonType: 'number',
              description: 'User weight in kg',
            },
            gender: {
              enum: [0, 1],
              description: 'User gender',
            },
            interests: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
              description: 'Array of interest references',
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // Create indexes for performance
    const collection = db.collection('users');
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ createdAt: -1 });

    // Seed sample users
    const users = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: '$2b$10$.wUmb0MkoCJGilOZGgl6d.Jfi3MmGwj3tFW3SljICg1M5Psh6Z7Cy',
        about: 'Software developer passionate about web technologies',
        birthday: new Date('1990-05-15'),
        height: 165,
        weight: 60,
        gender: 1,
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        password: '$2b$10$.wUmb0MkoCJGilOZGgl6d.Jfi3MmGwj3tFW3SljICg1M5Psh6Z7Cy',
        about: 'Designer and creative thinker',
        birthday: new Date('1992-08-22'),
        height: 180,
        weight: 75,
        gender: 0,
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol@example.com',
        password: '$2b$10$.wUmb0MkoCJGilOZGgl6d.Jfi3MmGwj3tFW3SljICg1M5Psh6Z7Cy',
        about: 'Marketing specialist and travel enthusiast',
        birthday: new Date('1995-03-10'),
        height: 170,
        weight: 65,
        gender: 1,
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await collection.insertMany(users);

    console.log('✅ Created users collection with sample data');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: users collection');
    await db.collection('users').drop();
    console.log('✅ Dropped users collection');
  }
}
