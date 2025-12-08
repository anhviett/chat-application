# MongoDB Migrations Guide

A Laravel-like migration system for MongoDB in NestJS. Easily create, run, and rollback database collections and indexes.

## Overview

This migration system provides you with:
- ✅ Version control for database schema changes
- ✅ Easy rollback functionality
- ✅ Automatic migration tracking
- ✅ Clean, organized migration files
- ✅ Performance index creation

## Quick Start

### 1. Run All Pending Migrations

```bash
npm run migrate
```

This command will:
- Connect to MongoDB
- Execute all migrations that haven't been run yet
- Save a record of executed migrations
- Display execution time for each migration

Output example:
```
🚀 MongoDB Migrations

⬆️  Running: Create users collection
✅ Done: 1_create_users_collection (45ms)

⬆️  Running: Create interests collection
✅ Done: 2_create_interests_collection (32ms)

⬆️  Running: Create conversations collection
✅ Done: 3_create_conversations_collection (38ms)

⬆️  Running: Create messages collection
✅ Done: 4_create_messages_collection (52ms)

✨ Successfully executed 4 migration(s)
```

### 2. Check Migration Status

```bash
npm run migrate:status
```

Shows:
- Database name
- Total number of migrations
- Number of executed migrations
- List of executed migrations with timestamps and duration

### 3. Rollback Last Migration

```bash
npm run migrate:rollback
```

Reverts the most recent migration and removes its record from the database.

### 4. Rollback All Migrations

```bash
npm run migrate:rollback:all
```

Reverts all executed migrations in reverse order.

## Project Structure

```
src/
├── database/
│   ├── migrations/
│   │   ├── migration.interface.ts           # Migration interface definition
│   │   ├── migration.service.ts            # Migration runner service
│   │   ├── 1_create_users_collection.migration.ts
│   │   ├── 2_create_interests_collection.migration.ts
│   │   ├── 3_create_conversations_collection.migration.ts
│   │   └── 4_create_messages_collection.migration.ts
│   └── cli.ts                              # CLI entry point
```

## Creating New Migrations

### Step 1: Create a Migration File

Create a file named `5_create_your_collection.migration.ts`:

```typescript
import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateYourCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create your collection');

    await db.createCollection('your_collection', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name'],
          properties: {
            _id: { bsonType: 'objectId' },
            name: {
              bsonType: 'string',
              description: 'Your field description',
            },
            // Add more fields as needed
          },
        },
      },
    });

    const collection = db.collection('your_collection');
    await collection.createIndex({ name: 1 });

    console.log('✅ Created your collection');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: your collection');
    await db.collection('your_collection').drop();
    console.log('✅ Dropped your collection');
  }
}
```

### Step 2: Register Migration in MigrationService

Add to `migration.service.ts` in the migrations object:

```typescript
private migrations: { [key: string]: Migration } = {
  '1_create_users_collection': new CreateUsersCollectionMigration(),
  '2_create_interests_collection': new CreateInterestsCollectionMigration(),
  '3_create_conversations_collection': new CreateConversationsCollectionMigration(),
  '4_create_messages_collection': new CreateMessagesCollectionMigration(),
  '5_create_your_collection': new CreateYourCollectionMigration(), // Add this
};
```

### Step 3: Run the Migration

```bash
npm run migrate
```

## Migration Examples

### Example 1: Simple Collection with Indexes

```typescript
async up(db: Db): Promise<void> {
  await db.createCollection('products', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'price'],
        properties: {
          _id: { bsonType: 'objectId' },
          name: { bsonType: 'string' },
          price: { bsonType: 'number' },
          description: { bsonType: 'string' },
          inStock: { bsonType: 'bool', default: true },
        },
      },
    },
  });

  const collection = db.collection('products');
  await collection.createIndex({ name: 1 });
  await collection.createIndex({ price: -1 });
  await collection.createIndex({ inStock: 1 });
}

async down(db: Db): Promise<void> {
  await db.collection('products').drop();
}
```

### Example 2: Collection with Relationships

```typescript
async up(db: Db): Promise<void> {
  await db.createCollection('orders', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'items', 'totalPrice'],
        properties: {
          _id: { bsonType: 'objectId' },
          userId: { 
            bsonType: 'objectId',
            description: 'Reference to user',
          },
          items: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              properties: {
                productId: { bsonType: 'objectId' },
                quantity: { bsonType: 'number' },
                price: { bsonType: 'number' },
              },
            },
          },
          totalPrice: { bsonType: 'number' },
          status: {
            enum: ['pending', 'completed', 'cancelled'],
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' },
        },
      },
    },
  });

  const collection = db.collection('orders');
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ createdAt: -1 });
}

async down(db: Db): Promise<void> {
  await db.collection('orders').drop();
}
```

## Built-in Collections

### users
Stores user account information
- Fields: name, username, email, password, about, birthday, height, weight, gender, interests

### interests
Stores interest/hobby categories
- Fields: name

### conversations
Stores chat conversations (direct messages, groups, channels)
- Fields: type, participants, createdBy, name, avatar, description, lastMessage, participantMetadata, admins, isArchived, settings

### messages
Stores chat messages
- Fields: sender, conversationId, content, type, status, readBy, replyTo, attachments, isDeleted

## Environment Variables

Make sure your `.env` file has:

```env
MONGODB_URI=mongodb://localhost:27017
MONGO_DATABASE=chat_app
```

Or for MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat_app?retryWrites=true&w=majority
MONGO_DATABASE=chat_app
```

## NPM Scripts

```json
{
  "migrate": "ts-node src/database/cli.ts migrate",
  "migrate:rollback": "ts-node src/database/cli.ts rollback",
  "migrate:rollback:all": "ts-node src/database/cli.ts rollback --all",
  "migrate:status": "ts-node src/database/cli.ts status"
}
```

## Best Practices

1. **Naming Convention**: Use format `N_description.migration.ts` where N is a number
2. **Idempotency**: Migrations should handle cases where they might run multiple times
3. **Atomic Operations**: Keep migrations focused on a single concern
4. **Testing**: Test your migrations in development before deploying
5. **Documentation**: Add clear descriptions in your schema validators
6. **Index Creation**: Always create appropriate indexes for query performance

## Troubleshooting

### ❌ "Cannot create collection, database not found"
Make sure your MongoDB URI and database name are correct in `.env`.

### ❌ "Connection refused"
Ensure MongoDB is running:
```bash
# Local MongoDB
mongod

# Docker
docker-compose up -d mongo

# MongoDB Atlas
Check your connection string
```

### ❌ "Duplicate key error"
If a migration fails partway through, you may need to manually drop the collection and rollback:
```bash
npm run migrate:rollback
```

### ❌ Migration stuck or slow
- Check MongoDB logs
- Verify network connectivity
- Try running migrations on a test database first

## Migration Records

Migrations are tracked in the `migrations` collection:

```javascript
{
  _id: ObjectId,
  name: "1_create_users_collection",
  executedAt: ISODate("2025-12-08T10:30:45.123Z"),
  duration: 45  // milliseconds
}
```

This allows the system to know which migrations have already been executed.

## API Reference

### MigrationService

#### `runMigrations(): Promise<void>`
Executes all pending migrations.

#### `rollbackLastMigration(): Promise<void>`
Rolls back the most recently executed migration.

#### `rollbackAllMigrations(): Promise<void>`
Rolls back all executed migrations in reverse order.

#### `getMigrationStatus(): Promise<void>`
Displays the current migration status.

## Advanced Usage

### Running Migrations Programmatically

```typescript
import { MigrationService } from './database/migrations/migration.service';

// In your service
constructor(private migrationService: MigrationService) {}

async seedDatabase() {
  await this.migrationService.runMigrations();
}
```

### Custom Migration Scripts

You can create custom npm scripts for specific tasks:

```json
{
  "db:setup": "npm run migrate && npm run seed",
  "db:reset": "npm run migrate:rollback:all && npm run migrate"
}
```

## Additional Resources

- [MongoDB Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)
- [NestJS MongoDB Integration](https://docs.nestjs.com/techniques/mongodb)
- [MongoDB BSON Types](https://docs.mongodb.com/manual/reference/bson-types/)

---

**Version**: 1.0.0  
**Last Updated**: December 8, 2025
