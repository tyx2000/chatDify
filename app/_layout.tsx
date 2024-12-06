import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { Text } from 'react-native';

export default function RootLayout() {
  const initDB = async () => {
    await SQLite.deleteDatabaseAsync('chatRecord');
    const db = await SQLite.openDatabaseAsync('chatRecord');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL, message_id TEXT NOT NULL, created_at TEXT NOT NULL, type TEXT NOT NULL, sender TEXT NOT NULL, blob_content BLOB, text_content TEXT);
    `);
  };

  useEffect(() => {
    console.log('layout effect');
    initDB();
  }, []);

  return (
    <SQLiteProvider databaseName="chatRecord">
      <Stack screenOptions={{}} />
    </SQLiteProvider>
  );
}
