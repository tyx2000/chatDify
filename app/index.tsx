import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '@/interfaces';
import InputWrapper from '@/components/InputWrapper';
import { useSQLiteContext } from 'expo-sqlite';

export default function Index() {
  const listRef = useRef();
  const db = useSQLiteContext();
  const { top, bottom } = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log('app init', top, bottom);
    const init = async () => {
      const res = await db.getAllAsync('SELECT * FROM messages');
      console.log('init', res);
    };
    init();
  }, []);

  // @ts-ignore
  const scrollToEnd = () => listRef.current && listRef.current.scrollToEnd();

  const send = async (val: string) => {
    const localSend: Message = {
      message_id: Math.random().toString(36).slice(0, 20),
      sender: 'local',
      created_at: Date.now() + '',
      type: 'text',
      text_content: val,
    };
    const remoteSend: Message = {
      message_id: Math.random().toString(36).slice(0, 20),
      sender: 'remote',
      created_at: Date.now() + '',
      type: 'text',
      text_content: val,
    };

    try {
      await db.runAsync(
        'INSERT INTO messages (message_id, sender, created_at, type, text_content) VALUES (?, ?, ?, ?, ?)',
        localSend.message_id,
        localSend.sender,
        localSend.created_at,
        localSend.type,
        // @ts-ignore
        localSend.text_content,
      );

      await db.runAsync(
        'INSERT INTO messages (message_id, sender, created_at, type, text_content) VALUES (?, ?, ?, ?, ?)',
        remoteSend.message_id,
        remoteSend.sender,
        remoteSend.created_at,
        remoteSend.type,
        // @ts-ignore
        remoteSend.text_content,
      );
    } catch (err) {
      console.log('ee', err);
    }
    setMessages((c) => [...c, localSend]);

    scrollToEnd();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setMessages((c) => [...c, remoteSend]);

    scrollToEnd();
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlashList
          // @ts-ignore
          ref={listRef}
          estimatedItemSize={100}
          data={messages}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View key={item.message_id} style={styles[item.sender]}>
              {/* @ts-ignore */}
              <View style={styles[item.sender + 'Wrapper']}>
                {/* @ts-ignore */}
                <Text selectable style={styles[item.sender + 'Content']}>
                  {item.text_content}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <InputWrapper send={send} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },

  list: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  local: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  remote: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  localWrapper: {
    maxWidth: '60%',
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 10,
  },
  localContent: {
    color: '#fff',
  },
  remoteWrapper: {
    maxWidth: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
  },
  remoteContent: {},
});
