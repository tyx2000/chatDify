import { useSQLiteContext } from 'expo-sqlite';

export const useSqlite = () => {
  const db = useSQLiteContext();
  const insertThread = async (conversation_id: string, title: string) => {
    const res = await db.runAsync(
      'INSERT INTO threads (conversation_id, title) VALUES (?, ?)',
      conversation_id,
      title,
    );
    return !!res.changes;
  };

  const selectAllThread = async () => {
    const res = await db.getAllAsync('SELECT * FROM threads');
    return res;
  };

  const updateThread = async (conversation_id: string, title: string) => {
    const res = await db.runAsync(
      'UPDATE threads set title = ? WHERE conversation_id = ?',
      title,
      conversation_id,
    );
    return !!res.changes;
  };

  const deleteThread = async (conversation_id: string) => {
    const res = await db.runAsync('DELETE FROM threads WHERE conversation_id = ?', conversation_id);
    return !!res.changes;
  };

  const insertMessage = async (
    conversation_id: string,
    message_id: string,
    created_at: string,
    type: string,
    sender: string,
    text_content: string,
  ) => {
    const res = await db.runAsync(
      'INSERT INTO messages (conversation_id, message_id, created_at, type, sender, text_content) VALUES (?, ?, ?, ?, ?, ?)',
      conversation_id,
      message_id,
      created_at,
      type,
      sender,
      text_content,
    );
    return !!res.changes;
  };

  const selectMessage = async (conversation_id: string) => {
    const res = await db.getAllAsync(
      'SELECT * from messages WHERE conversation_id = ?',
      conversation_id,
    );
    return res;
  };

  return {
    insertThread,
    selectAllThread,
    updateThread,
    deleteThread,
    insertMessage,
    selectMessage,
  };
};
