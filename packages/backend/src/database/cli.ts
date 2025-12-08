import * as dotenv from 'dotenv';
import { CreateUsersCollectionMigration } from './migrations/1_create_users_collection.migration';
import { CreateInterestsCollectionMigration } from './migrations/2_create_interests_collection.migration';
import { CreateConversationsCollectionMigration } from './migrations/3_create_conversations_collection.migration';
import { CreateMessagesCollectionMigration } from './migrations/4_create_messages_collection.migration';
import { MongoClient, Db } from 'mongodb';

// Load environment variables
dotenv.config();

interface MigrationRecord {
  _id?: string;
  name: string;
  executedAt: Date;
  duration: number;
}

class MigrationRunner {
  private mongoUri: string;
  private dbName: string;
  private client: MongoClient;
  private db: Db;

  private migrations = {
    '1_create_users_collection': new CreateUsersCollectionMigration(),
    '2_create_interests_collection': new CreateInterestsCollectionMigration(),
    '3_create_conversations_collection':
      new CreateConversationsCollectionMigration(),
    '4_create_messages_collection': new CreateMessagesCollectionMigration(),
  };

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

  async runMigrations(): Promise<void> {
    try {
      await this.connect();

      // Try to list collections with error handling
      let collections: any[] = [];
      try {
        collections = await this.db.listCollections().toArray();
      } catch (error) {
        // If listCollections fails but connection is OK, continue
        console.log('⚠️  Could not list collections, continuing...');
        collections = [];
      }

      const migrationCollectionExists = collections.some(
        (c) => c.name === 'migrations',
      );

      if (!migrationCollectionExists) {
        await this.db.createCollection('migrations');
      }

      const migrationsCollection = this.db.collection('migrations');
      const executedMigrations = await migrationsCollection
        .find({})
        .toArray();
      const executedNames = executedMigrations.map((m) => m.name);

      console.log('\n🚀 MongoDB Migrations\n');

      let migrationsCount = 0;

      for (const [name, migration] of Object.entries(this.migrations)) {
        if (executedNames.includes(name)) {
          console.log(`⏭️  Skipped: ${name} (already executed)`);
          continue;
        }

        const startTime = Date.now();

        try {
          await migration.up(this.db);
          const duration = Date.now() - startTime;

          await migrationsCollection.insertOne({
            name,
            executedAt: new Date(),
            duration,
          });

          console.log(`✅ Done: ${name} (${duration}ms)\n`);
          migrationsCount++;
        } catch (error) {
          console.error(`❌ Failed: ${name}`);
          console.error(error);
          throw error;
        }
      }

      if (migrationsCount === 0) {
        console.log('📭 No new migrations to run');
      } else {
        console.log(
          `\n✨ Successfully executed ${migrationsCount} migration(s)`,
        );
      }
    } finally {
      await this.disconnect();
    }
  }

  async rollbackLastMigration(): Promise<void> {
    try {
      await this.connect();

      const migrationsCollection = this.db.collection('migrations');
      const lastMigration = await migrationsCollection.findOne(
        {},
        { sort: { executedAt: -1 } },
      );

      if (!lastMigration) {
        console.log('❌ No migrations to rollback');
        return;
      }

      const migration = this.migrations[lastMigration.name];
      if (!migration) {
        console.log(`❌ Migration "${lastMigration.name}" not found`);
        return;
      }

      console.log(`\n⏮️  Rollback: ${lastMigration.name}\n`);

      try {
        await migration.down(this.db);
        await migrationsCollection.deleteOne({ _id: lastMigration._id });
        console.log(`✅ Rolled back: ${lastMigration.name}`);
      } catch (error) {
        console.error(`❌ Failed to rollback: ${lastMigration.name}`);
        console.error(error);
        throw error;
      }
    } finally {
      await this.disconnect();
    }
  }

  async rollbackAllMigrations(): Promise<void> {
    try {
      await this.connect();

      const migrationsCollection = this.db.collection('migrations');
      const allMigrations = await migrationsCollection
        .find({})
        .sort({ executedAt: -1 })
        .toArray();

      if (allMigrations.length === 0) {
        console.log('❌ No migrations to rollback');
        return;
      }

      console.log(
        `\n⏮️  Rolling back ${allMigrations.length} migration(s)\n`,
      );

      for (const record of allMigrations) {
        const migration = this.migrations[record.name];
        if (!migration) {
          console.log(`⚠️  Migration "${record.name}" not found, skipping`);
          continue;
        }

        try {
          await migration.down(this.db);
          await migrationsCollection.deleteOne({ _id: record._id });
          console.log(`✅ Rolled back: ${record.name}`);
        } catch (error) {
          console.error(`❌ Failed to rollback: ${record.name}`);
          console.error(error);
          throw error;
        }
      }

      console.log('\n✨ All migrations rolled back');
    } finally {
      await this.disconnect();
    }
  }

  async getMigrationStatus(): Promise<void> {
    try {
      await this.connect();

      const migrationsCollection = this.db.collection('migrations');
      const executedMigrations = await migrationsCollection
        .find({})
        .sort({ executedAt: 1 })
        .toArray();

      console.log('\n📊 Migration Status\n');
      console.log(`Database: ${this.dbName}`);
      console.log(
        `Total migrations: ${Object.keys(this.migrations).length}`,
      );
      console.log(`Executed: ${executedMigrations.length}\n`);

      if (executedMigrations.length === 0) {
        console.log('No migrations executed yet.');
        return;
      }

      console.log('Executed migrations:');
      for (const migration of executedMigrations) {
        const date = new Date(migration.executedAt).toLocaleString();
        console.log(
          `  ✅ ${migration.name} - ${date} (${migration.duration}ms)`,
        );
      }
    } finally {
      await this.disconnect();
    }
  }
}

async function main() {
  const runner = new MigrationRunner();
  const command = process.argv[2];
  const option = process.argv[3];

  // Debug info
  const dbUri = process.env.MONGO_USERNAME 
    ? `mongodb://${process.env.MONGO_USERNAME}:****@...`
    : (process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017');
  console.log(`Database: ${process.env.MONGO_DATABASE || 'chat_app'}`);
  console.log(`URI: ${dbUri}\n`);

  try {
    switch (command) {
      case 'migrate':
        await runner.runMigrations();
        break;

      case 'rollback':
        if (option === '--all') {
          await runner.rollbackAllMigrations();
        } else {
          await runner.rollbackLastMigration();
        }
        break;

      case 'status':
        await runner.getMigrationStatus();
        break;

      default:
        console.log(`
Usage: npm run migrate <command> [options]

Commands:
  migrate              Run all pending migrations
  rollback             Rollback the last migration
  rollback --all       Rollback all migrations
  status               Show migration status

Examples:
  npm run migrate migrate
  npm run migrate rollback
  npm run migrate rollback --all
  npm run migrate status
        `);
    }
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
