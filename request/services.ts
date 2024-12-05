import { ChatMessageParams, ChatMessageResult } from '@/interfaces';
import api from './api';
import fetcher from './fetcher';
import fetchSSE from './fetchSSE';

const chatService = {
  chatMessage: ({ query, conversation_id = '' }: ChatMessageParams) =>
    fetcher<ChatMessageResult>(api.chatMessage, {
      method: 'POST',
      body: JSON.stringify({
        query,
        inputs: {},
        response_mode: 'blocking',
        user: 'yu68227',
        conversation_id,
        files: '',
        auto_generate_name: true,
      }),
    }),
};

export default chatService;
