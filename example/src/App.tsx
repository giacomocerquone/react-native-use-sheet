import * as React from 'react';

import { useState, forwardRef } from 'react';
import { StyleSheet, View, Button, Text, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSheet, SheetProvider } from 'react-native-use-sheet';

const SheetContent = forwardRef<ScrollView>((props, ref) => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScrollView
      {...props}
      ref={ref}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    >
      {new Array(100).fill(1).map((_, idx) => (
        <Text key={idx} style={{ color: '#000' }}>
          text text text
        </Text>
      ))}
    </ScrollView>
  );
});

const MyComponent = () => {
  const { openSheet } = useSheet({
    content: SheetContent,
  });

  return (
    <View style={styles.container}>
      <Button onPress={() => openSheet()} title="Open it" />
    </View>
  );
};

export default function App() {
  return (
    <SheetProvider>
      <MyComponent />
    </SheetProvider>
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
