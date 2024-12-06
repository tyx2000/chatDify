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

const ReAnimatedTextInput = ReAnimated.createAnimatedComponent(TextInput);

export default function InputWrapper({ send }: { send: Function }) {
  const { bottom } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

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

  return (
    <ReAnimated.View style={[{ paddingBottom: bottom || 10 }, styles.wrapper, translateStyle]}>
      <ReAnimatedTextInput
        style={[styles.textInput, { borderColor: inputFocusBorderColor }]}
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
    borderWidth: 1,
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
