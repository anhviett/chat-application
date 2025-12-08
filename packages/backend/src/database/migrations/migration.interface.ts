import { Db } from 'mongodb';

export interface Migration {
  up(db: Db): Promise<void>;
  down(db: Db): Promise<void>;
}

export interface MigrationRecord {
  _id?: string;
  name: string;
  executedAt: Date;
  duration: number; // milliseconds
}
