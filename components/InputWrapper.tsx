import SystemContext from '@/context/SystemContext';
import chatService from '@/request/services';
import { useContext, useEffect, useState } from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ReAnimated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '@/interfaces';
import { useSqlite } from '@/db/sqlite';

const ReAnimatedTextInput = ReAnimated.createAnimatedComponent(TextInput);

export default function InputWrapper() {
  const { bottom } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const { insertMessage } = useSqlite();
  const { currentThread = {}, setMessages } = useContext(SystemContext);
  const [value, setValue] = useState('');

  const translateStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  const inputFocusBorderColor = useSharedValue('#ccc');
  const sendButtonBgc = useSharedValue('#ccc');

  // @ts-ignore
  const onTextChange = ({ nativeEvent: { text } }) => {
    setValue(text);
    sendButtonBgc.value = withTiming(text.length ? '#007aff' : '#ccc');
  };

  useEffect(() => {
    console.log('input init');
  }, []);

  const send = async (query: string) => {
    console.log(query);
    const localSend: Message = {
      conversation_id: currentThread.conversation_id,
      message_id: Date.now() + '',
      created_at: Date.now() + '',
      type: 'text',
      sender: 'local',
      text_content: query,
    };
    const localSendSuccess = await insertMessage(
      localSend.conversation_id,
      localSend.message_id,
      localSend.created_at,
      localSend.type,
      localSend.sender,
      localSend.text_content,
    );

    if (localSendSuccess) {
      setMessages((c) => [...c, localSend]);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const remoteSend: Message = {
      conversation_id: currentThread.conversation_id,
      message_id: Date.now() + '',
      created_at: Date.now() + '',
      type: 'text',
      sender: 'remote',
      text_content: query,
    };

    const remoteSendSuccess = await insertMessage(
      remoteSend.conversation_id,
      remoteSend.message_id,
      remoteSend.created_at,
      remoteSend.type,
      remoteSend.sender,
      remoteSend.text_content,
    );
    if (remoteSendSuccess) {
      setMessages((c) => [...c, remoteSend]);
    }
  };

  return (
    <ReAnimated.View style={[{ paddingBottom: bottom || 10 }, styles.wrapper, translateStyle]}>
      <ReAnimatedTextInput
        style={[styles.textInput, { borderColor: inputFocusBorderColor }]}
        placeholder="Ask something"
        value={value}
        onChange={onTextChange}
        onFocus={() => {
          inputFocusBorderColor.value = withTiming('#007aff');
        }}
        onBlur={() => {
          inputFocusBorderColor.value = withTiming('#ccc');
        }}
      />
      <TouchableOpacity
        onPress={() => {
          send(value);
          setValue('');
        }}
      >
        <ReAnimated.View style={[styles.sendButton, { backgroundColor: sendButtonBgc }]}>
          <Text style={styles.sendText}>Send</Text>
        </ReAnimated.View>
      </TouchableOpacity>
    </ReAnimated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    height: 35,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flex: 1,
  },
  sendButton: {
    width: 50,
    height: 35,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontSize: 16,
    color: '#fff',
  },
});
