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
          required: ['name', 'username', 'email', 'password'],
          properties: {
            _id: { bsonType: 'objectId' },
            name: { bsonType: 'string', description: 'User full name' },
            username: {
              bsonType: 'string',
              description: 'Unique username for login',
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
              enum: ['male', 'female', 'other'],
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
    await collection.createIndex({ username: 1 }, { unique: true });
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ createdAt: -1 });

    // Seed sample users
    const users = [
      {
        name: 'Alice Johnson',
        username: 'alice_johnson',
        email: 'alice@example.com',
        password: '$2b$10$hashedpassword1',
        about: 'Software developer passionate about web technologies',
        birthday: new Date('1990-05-15'),
        height: 165,
        weight: 60,
        gender: 'female',
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bob Smith',
        username: 'bob_smith',
        email: 'bob@example.com',
        password: '$2b$10$hashedpassword2',
        about: 'Designer and creative thinker',
        birthday: new Date('1992-08-22'),
        height: 180,
        weight: 75,
        gender: 'male',
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Carol Williams',
        username: 'carol_williams',
        email: 'carol@example.com',
        password: '$2b$10$hashedpassword3',
        about: 'Marketing specialist and travel enthusiast',
        birthday: new Date('1995-03-10'),
        height: 170,
        weight: 65,
        gender: 'female',
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
