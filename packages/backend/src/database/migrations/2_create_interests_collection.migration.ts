import { Db } from 'mongodb';
import { Migration } from './migration.interface';

export class CreateInterestsCollectionMigration implements Migration {
  async up(db: Db): Promise<void> {
    console.log('⬆️  Running: Create interests collection');

    await db.createCollection('interests', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name'],
          properties: {
            _id: { bsonType: 'objectId' },
            name: {
              bsonType: 'string',
              description: 'Interest name (e.g., Reading, Gaming, Sports)',
            },
          },
        },
      },
    });

    const collection = db.collection('interests');
    await collection.createIndex({ name: 1 });

    // Seed sample interests
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
    await collection.insertMany(interests);

    console.log('✅ Created interests collection with sample data');
  }

  async down(db: Db): Promise<void> {
    console.log('⬇️  Dropping: interests collection');
    await db.collection('interests').drop();
    console.log('✅ Dropped interests collection');
  }
}

