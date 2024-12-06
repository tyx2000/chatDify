export interface ChatMessageParams {
  query: string;
  conversation_id?: string;
}

export interface ChatMessageResult {
  answer: string;
  conversation_id: string;
  created_at: number;
  event: string;
  id: string;
  message_id: string;
  task_id: string;
}

const history = [
  {
    conversation_id: 1,
    title: '',
  },
];

export interface Message {
  created_at: string;
  sender: 'local' | 'remote';
  text_content?: string | undefined;
  blob_content?: Blob | undefined;
  message_id: string;
  type: 'text' | 'blob';
}
