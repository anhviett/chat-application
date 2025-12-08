import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { Migration, MigrationRecord } from './migration.interface';
import { CreateUsersCollectionMigration } from './1_create_users_collection.migration';
import { CreateInterestsCollectionMigration } from './2_create_interests_collection.migration';
import { CreateConversationsCollectionMigration } from './3_create_conversations_collection.migration';
import { CreateMessagesCollectionMigration } from './4_create_messages_collection.migration';

@Injectable()
export class MigrationService {
  private mongoUri: string;
  private dbName: string;
  private client: MongoClient;
  private db: Db;

  // List of all migrations in order
  private migrations: { [key: string]: Migration } = {
    '1_create_users_collection': new CreateUsersCollectionMigration(),
    '2_create_interests_collection': new CreateInterestsCollectionMigration(),
    '3_create_conversations_collection':
      new CreateConversationsCollectionMigration(),
    '4_create_messages_collection': new CreateMessagesCollectionMigration(),
  };

  constructor() {
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.dbName = this.extractDatabaseName(this.mongoUri);
  }

  private extractDatabaseName(uri: string): string {
    try {
      const url = new URL(uri);
      const pathname = url.pathname;
      return pathname.substring(1) || 'chat_app'; // Remove leading /
    } catch {
      return 'chat_app';
    }
  }

  async connect(): Promise<void> {
    this.client = new MongoClient(this.mongoUri);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log(`✅ Connected to MongoDB: ${this.dbName}`);
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

      // Create migrations collection if not exists
      const collections = await this.db.listCollections().toArray();
      const migrationCollectionExists = collections.some(
        (c) => c.name === 'migrations',
      );

      if (!migrationCollectionExists) {
        await this.db.createCollection('migrations');
      }

      const migrationsCollection = this.db.collection('migrations');

      // Get already executed migrations
      const executedMigrations = await migrationsCollection
        .find({})
        .toArray();
      const executedNames = executedMigrations.map((m) => m.name);

      console.log('\n🚀 MongoDB Migrations\n');

      let migrationsCount = 0;

      // Run pending migrations
      for (const [name, migration] of Object.entries(this.migrations)) {
        if (executedNames.includes(name)) {
          console.log(`⏭️  Skipped: ${name} (already executed)`);
          continue;
        }

        const startTime = Date.now();

        try {
          await migration.up(this.db);
          const duration = Date.now() - startTime;

          // Save migration record
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
