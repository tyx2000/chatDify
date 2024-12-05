import SystemContext from '@/context/SystemContext';
import { useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReAnimated, { FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

export default function DrawerContent() {
  const { top, bottom } = useSafeAreaInsets();
  const { chatHistory = [], openDrawer, setCurrentThread } = useContext(SystemContext);

  return (
    <View style={[{ paddingTop: top, paddingBottom: bottom || 20 }, styles.container]}>
      <Text style={styles.title}>Threads</Text>
      {chatHistory.length > 0 ? (
        <ScrollView contentContainerStyle={[styles.scrollView]}>
          {chatHistory.map((item: { conversation_id: string; title: string }) => (
            <TouchableOpacity
              key={item.conversation_id}
              onPress={() => {
                setCurrentThread(item);
                openDrawer(false);
              }}
            >
              <ReAnimated.View entering={FadeIn} style={styles.thread}>
                <Text style={styles.threadTitle}>{item.title}</Text>
              </ReAnimated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyThread}>
          <Text>New Thread</Text>
          <TouchableOpacity onPress={() => openDrawer(false)}>
            <MaterialIcons size={20} name="arrow-circle-right" color="purple" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightyellow',
    paddingLeft: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    fontStyle: 'italic',
    marginTop: 20,
  },
  scrollView: {
    paddingVertical: 20,
  },
  thread: {
    height: 40,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  threadTitle: {
    fontSize: 16,
    color: 'purple',
  },
  emptyThread: {
    marginTop: 40,
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});
