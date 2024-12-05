import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import SystemContext from '@/context/SystemContext';
import HeaderMid from './HeaderMid';

export default function () {
  const { top } = useSafeAreaInsets();
  const { theme, setTheme, openDrawer } = useContext(SystemContext);
  const isLight = theme === 'light';

  return (
    <View style={[{ marginTop: top }, styles.container]}>
      <TouchableOpacity onPress={() => openDrawer(true)}>
        <MaterialIcons name="all-inclusive" size={20} />
      </TouchableOpacity>

      <HeaderMid />
      <TouchableOpacity onPress={() => setTheme(isLight ? 'dark' : 'light')}>
        <MaterialIcons
          name={`${isLight ? 'light' : 'dark'}-mode`}
          size={20}
          color={isLight ? 'purple' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
