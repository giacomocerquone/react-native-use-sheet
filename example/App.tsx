import * as React from 'react';

import { useState, forwardRef } from 'react';
import { StyleSheet, View, Button, Text, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSheet, SheetProvider } from 'react-native-use-sheet';

const SheetContent = forwardRef<FlatList>((props, ref) => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      {...props}
      ref={ref}
      data={new Array(100).fill(1)}
      ListHeaderComponent={
        <TextInput placeholder="hey there" onChangeText={() => null} />
      }
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
      renderItem={({ index: idx }) => {
        return (
          <Text key={idx} style={{ color: '#000' }}>
            text text text
          </Text>
        );
      }}
    />
  );
});

const MyComponent = () => {
  const { openSheet } = useSheet({
    content: SheetContent,
  });

  return (
    <View style={styles.container}>
      <Button onPress={openSheet} title="Open it" />
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
