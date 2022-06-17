import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';
import {
  useBottomSheet,
  BottomSheetProvider,
} from 'react-native-usebottomsheet';

const BottomSheetUsage = () => {
  const { openSheet } = useBottomSheet();

  return (
    <View style={styles.container}>
      <Button
        onPress={() =>
          openSheet({
            node: (props) => (
              <Text style={{ color: '#000' }} {...props}>
                hihihihihihihihihihihihihihihi
              </Text>
            ),
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
