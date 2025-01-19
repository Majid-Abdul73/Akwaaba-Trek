import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('akwaaba.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS saved_destinations (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );`
    );
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destinationId TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
      );`
    );
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const getSavedDestinations = async (): Promise<Array<{ id: string, data: string }>> => {
  try {
    const result = await db.getFirstAsync<{ id: string, data: string }>('SELECT * FROM saved_destinations');
    return result ? [result] : [];
  } catch (error) {
    console.error('Error getting saved destinations:', error);
    return [];
  }
};