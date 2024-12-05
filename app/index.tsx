import { View, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import InputWrapper from '@/components/InputWrapper';
import Content from '@/components/Content';

import { useContext, useEffect } from 'react';
import SystemContext from '@/context/SystemContext';

export default function Index() {
  useEffect(() => {
    console.log('app init');
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <Content />
      <InputWrapper />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'purple',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: '#fff',
  },
});
