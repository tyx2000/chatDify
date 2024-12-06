import { Text, TextInput, View, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Fragment, useContext, useState } from 'react';
import SystemContext from '@/context/SystemContext';
import * as SQLite from 'expo-sqlite';
import { useSqlite } from '@/db/sqlite';

const operations = [
  {
    name: 'New Thread',
    color: '#007aff',
    weight: 'normal',
  },
  {
    name: 'Rename',
    color: '#007aff',
    weight: 'normal',
  },
  {
    name: 'Delete',
    color: 'red',
    weight: 'light',
  },
  {
    name: 'Cancel',
    color: '#007aff',
    weight: 'bold',
  },
];

export default function HeaderMid() {
  const db = SQLite.useSQLiteContext();

  const { currentThread = {}, setCurrentThread } = useContext(SystemContext);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editThreadTitle, setEditThreadTitle] = useState('');

  const { insertThread, updateThread, deleteThread } = useSqlite();

  const onIconPress = async () => {
    if (editMode) {
      const { conversation_id, title } = currentThread;
      if (editThreadTitle !== title) {
        const success = await updateThread(conversation_id, editThreadTitle);
        if (success) {
          setCurrentThread({ conversation_id, title: editThreadTitle });
        }
      }
      setEditMode(false);
    } else {
      setShowModal(true);
    }
  };

  const onNewThread = async () => {
    const conversation_id = Date.now() + '',
      title = '未命名';

    console.log('new');
    const success = await insertThread(conversation_id, title);
    if (success) {
      setCurrentThread({ conversation_id, title });
    }
  };

  const operateHandler = async (name: string) => {
    if (name === 'Rename') {
      setShowModal(false);
      setEditMode(true);
      setEditThreadTitle(currentThread.title);
    } else if (name === 'Detele') {
      const success = await deleteThread(currentThread.conversation_id);
      if (success) {
        setCurrentThread({});
      }
    } else if (name === 'Cancel') {
      setShowModal(false);
    } else {
      onNewThread();
    }
  };

  return (
    <View style={styles.container}>
      {currentThread.conversation_id ? (
        <Fragment>
          {editMode ? (
            <TextInput
              autoFocus
              style={styles.editInput}
              value={editThreadTitle}
              onChange={({ nativeEvent: { text } }) => setEditThreadTitle(text)}
            />
          ) : (
            <Text ellipsizeMode="middle" numberOfLines={1} style={styles.title}>
              {currentThread.title || ''}
            </Text>
          )}
          <TouchableOpacity style={styles.icon} onPress={onIconPress}>
            <MaterialIcons
              name={editMode ? 'done' : 'keyboard-arrow-down'}
              size={editMode ? 16 : 18}
            />
          </TouchableOpacity>
        </Fragment>
      ) : (
        <TouchableOpacity onPress={onNewThread} style={styles.newThreadBtn}>
          <Text style={styles.newThreadText}>New Thread</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => {
          Alert.alert('Modal closed');
          setShowModal(false);
        }}
      >
        <View style={styles.modalContent}>
          <View style={styles.operate}>
            {operations.map(({ name, color, weight }, index) => (
              <Fragment key={name}>
                <TouchableOpacity onPress={() => operateHandler(name)}>
                  <View style={styles.operateItem}>
                    {/* @ts-ignore */}
                    <Text style={{ color, fontWeight: weight }}>{name}</Text>
                  </View>
                </TouchableOpacity>
                {index < operations.length - 1 && <View style={styles.divider}></View>}
              </Fragment>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    maxWidth: 120,
    fontWeight: 'bold',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 100,
  },

  modalContent: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  operate: {
    zIndex: 999,
    width: '50%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  operateItem: {
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#007aff',
  },
  divider: {
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  newThreadBtn: {
    backgroundColor: '#007aff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  newThreadText: {
    color: '#fff',
  },
});
