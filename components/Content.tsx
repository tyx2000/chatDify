import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useRef, memo, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import SystemContext from '@/context/SystemContext';

export default function Content() {
  const listRef = useRef();
  // const db = SQLite.useSQLiteContext();

  const { messages }: { messages: Message[] } = useContext(SystemContext);

  useEffect(() => {
    console.log('content init======================', Date.now());

    // SQLite.addDatabaseChangeListener(({ databaseName, tableName, rowId }) => {
    //   console.log('listener', databaseName, tableName, rowId);
    //   if (databaseName === 'messages') {
    //     // @ts-ignore
    //     listRef.current && listRef.current.scrollToEnd({ animated: true });
    //   }
    // });
  }, []);

  return (
    <View style={styles.content}>
      <FlashList
        // @ts-ignore
        ref={listRef}
        estimatedItemSize={100}
        data={messages}
        contentContainerStyle={styles.container}
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
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f4f0ec',
  },
  container: {
    padding: 10,
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
