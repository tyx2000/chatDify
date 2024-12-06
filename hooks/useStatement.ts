import { useSQLiteContext } from 'expo-sqlite';

const useStatement = () => {
  const db = useSQLiteContext();

  const insertThread = async (conversation_id: string, title: string) => {
    const statement = await db.prepareAsync(
      'INSERT INTO threads (conversation_id, title) VALUES ($conversation_id, $title)',
    );

    try {
      let result = await statement.executeAsync({
        $conversation_id: conversation_id,
        $title: title,
      });

      return !!result.changes;
    } finally {
      await statement.finalizeAsync();
    }
  };

  const selectAllThread = async () => {
    const statement = await db.prepareAsync('SELECT * FROM threads');
  };

  const insertMessage = async (
    conversation_id: string,
    message_id: string,
    created_at: string,
    type: string,
    sender: string,
    text_content: string,
  ) => {
    const statement = await db.prepareAsync(
      'INSERT INTO messages (conversation_id, message_id, created_at, type, sender, text_content) VALUES ($conversation_id, $message_id, $type, $sender, $text_content)',
    );

    try {
      let result = await statement.executeAsync({
        $conversation_id: conversation_id,
        $message_id: message_id,
        $created_at: created_at,
        $type: type,
        $sender: sender,
        $text_content: text_content,
      });

      return !!result.changes;
    } finally {
      await statement.finalizeAsync();
    }
  };

  return { insertThread, insertMessage };
};

export default useStatement;
