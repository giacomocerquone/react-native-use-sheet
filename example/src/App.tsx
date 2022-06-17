import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  useBottomSheet,
  BottomSheetProvider,
} from 'react-native-usebottomsheet';

const SheetContent = (props) => {
  return (
    <ScrollView ref={props.scrollRef} {...props}>
      {new Array(10).fill(1).map(() => (
        <Text style={{ color: '#000' }}>text text text</Text>
      ))}
    </ScrollView>
  );
};

const BottomSheetUsage = () => {
  const { openSheet } = useBottomSheet();

  return (
    <View style={styles.container}>
      <Button
        onPress={() =>
          openSheet({
            node: SheetContent,
          })
        }
        title="Open it"
      />
    </View>
  );
};

export default function App() {
  return (
    <BottomSheetProvider>
      <BottomSheetUsage />
    </BottomSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
