import { Stack } from 'expo-router';
import DrawerContent from '@/components/DrawerContent';
import { Drawer } from 'react-native-drawer-layout';
import { useEffect, useState } from 'react';
import SystemContext from '@/context/SystemContext';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { Message } from '@/interfaces';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme || 'light');
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ conversation_id: string; title: string }[]>([]);
  const [currentThread, setCurrentThread] = useState<{ conversation_id: string; title: string }>();
  const [messages, setMessages] = useState<Message[]>([]);

  const initDB = async () => {
    await SQLite.deleteDatabaseAsync('chatRecord');
    const db = await SQLite.openDatabaseAsync('chatRecord', { enableChangeListener: true });

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS threads (id INTEGER PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL, title TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL, message_id TEXT NOT NULL, created_at TEXT NOT NULL, type TEXT NOT NULL, sender TEXT NOT NULL, blob_content BLOB, text_content TEXT);
    `);
  };

  useEffect(() => {
    console.log('layout effect');
    initDB();
  }, []);

  return (
    <SystemContext.Provider
      value={{
        chatHistory,
        theme: theme || 'light',
        setTheme,
        openDrawer: (trigger: boolean) => setOpen(trigger),
        currentThread,
        setCurrentThread,
        messages,
        setMessages,
      }}
    >
      <SQLiteProvider
        databaseName="chatRecord"
        options={{
          enableChangeListener: true,
        }}
      >
        <Drawer
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderDrawerContent={() => <DrawerContent />}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </Drawer>
      </SQLiteProvider>
    </SystemContext.Provider>
  );
}
