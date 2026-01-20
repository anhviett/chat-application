import * as dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

class DatabaseSeeder {
  private mongoUri: string;
  private dbName: string;
  private client: MongoClient;
  private db: Db;

  constructor() {
    // Use DATABASE_URL if available, otherwise build from components
    this.mongoUri =
      process.env.DATABASE_URL ||
      this.buildMongoUri();
    this.dbName = process.env.MONGO_DATABASE || 'chat_app';
  }

  private buildMongoUri(): string {
    const baseUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017';
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    
    if (username && password) {
      return baseUri.replace(
        'mongodb://',
        `mongodb://${username}:${password}@`
      );
    }
    
    return baseUri;
  }

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.mongoUri, {
        authSource: 'admin',
        retryWrites: true,
        w: 'majority',
      });
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`✅ Connected to MongoDB: ${this.dbName}`);
    } catch (error) {
      console.error('Connection error:', error.message);
      throw new Error(`Failed to connect to MongoDB at ${this.mongoUri}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('✅ Disconnected from MongoDB');
    }
  }

  async seed(): Promise<void> {
    try {
      await this.connect();

      console.log('\n🌱 Seeding Database\n');

      // 1. Seed Interests
      await this.seedInterests();

      // 2. Seed Users
      await this.seedUsers();

      // 3. Seed Conversations
      await this.seedConversations();

      // 4. Seed Messages
      await this.seedMessages();

      console.log('\n✨ Database seeding completed successfully!');
    } finally {
      await this.disconnect();
    }
  }

  private async seedInterests(): Promise<void> {
    const interestsCollection = this.db.collection('interests');
    
    // Check if interests already exist
    const count = await interestsCollection.countDocuments();
    if (count > 0) {
      console.log(`⏭️  Skipped: interests (${count} documents exist)`);
      return;
    }

    const interests = [
      { name: 'Reading' },
      { name: 'Gaming' },
      { name: 'Sports' },
      { name: 'Music' },
      { name: 'Cooking' },
      { name: 'Traveling' },
      { name: 'Photography' },
      { name: 'Art' },
      { name: 'Technology' },
      { name: 'Movies' },
    ];

    await interestsCollection.insertMany(interests);
    console.log(`✅ Seeded interests (${interests.length} documents)`);
  }

  private async seedUsers(): Promise<void> {
    const usersCollection = this.db.collection('users');
    const interestsCollection = this.db.collection('interests');

    // Check if users already exist
    const count = await usersCollection.countDocuments();
    if (count > 0) {
      console.log(`⏭️  Skipped: users (${count} documents exist)`);
      return;
    }

    // Get some interests to reference
    const interests = await interestsCollection.find().limit(3).toArray();
    const interestIds = interests.map(i => i.id);

    const users = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
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
        firstName: 'Bob',
        lastName: 'Smith',
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
        firstName: 'Carol',
        lastName: 'Williams',
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

    await usersCollection.insertMany(users);
    console.log(`✅ Seeded users (${users.length} documents)`);
  }

  private async seedConversations(): Promise<void> {
    const conversationsCollection = this.db.collection('conversations');
    const usersCollection = this.db.collection('users');

    // Check if conversations already exist
    const count = await conversationsCollection.countDocuments();
    if (count > 0) {
      console.log(`⏭️  Skipped: conversations (${count} documents exist)`);
      return;
    }

    // Get users to reference
    const users = await usersCollection.find().toArray();
    if (users.length < 2) {
      console.log('⚠️  Not enough users to create conversations');
      return;
    }

    const conversations = [
      {
        type: 'direct',
        participants: [users[0].id, users[1].id],
        createdBy: users[0].id,
        participantMetadata: {
          [users[0].id.toString()]: {
            unreadCount: 0,
            lastReadAt: new Date(),
          },
          [users[1].id.toString()]: {
            unreadCount: 2,
            lastReadAt: new Date(Date.now() - 3600000),
          },
        },
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'group',
        name: 'Development Team',
        participants: [users[0].id, users[1].id, users[2].id],
        createdBy: users[0].id,
        description: 'Group for development team discussions',
        avatar: 'https://example.com/avatar.jpg',
        participantMetadata: {
          [users[0].id.toString()]: {
            unreadCount: 0,
            lastReadAt: new Date(),
          },
          [users[1].id.toString()]: {
            unreadCount: 1,
            lastReadAt: new Date(Date.now() - 1800000),
          },
          [users[2].id.toString()]: {
            unreadCount: 3,
            lastReadAt: new Date(Date.now() - 7200000),
          },
        },
        admins: [users[0].id],
        isArchived: false,
        settings: {
          allowMemberToInvite: true,
          allowMemberToSendMedia: true,
          requireApprovalToJoin: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await conversationsCollection.insertMany(conversations);
    console.log(`✅ Seeded conversations (${conversations.length} documents)`);
  }

  private async seedMessages(): Promise<void> {
    const messagesCollection = this.db.collection('messages');
    const conversationsCollection = this.db.collection('conversations');
    const usersCollection = this.db.collection('users');

    // Check if messages already exist
    const count = await messagesCollection.countDocuments();
    if (count > 0) {
      console.log(`⏭️  Skipped: messages (${count} documents exist)`);
      return;
    }

    const conversations = await conversationsCollection.find().toArray();
    const users = await usersCollection.find().toArray();

    if (conversations.length === 0 || users.length === 0) {
      console.log('⚠️  Not enough conversations or users to create messages');
      return;
    }

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
      },
    ];

    await messagesCollection.insertMany(messages);
    console.log(`✅ Seeded messages (${messages.length} documents)`);
  }
}

async function main() {
  const seeder = new DatabaseSeeder();
  const command = process.argv[2];

  try {
    if (command === 'seed') {
      await seeder.seed();
    } else {
      console.log(`
Usage: npm run db:seed

Commands:
  db:seed              Seed the database with sample data

Example:
  npm run db:seed
      `);
    }
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
