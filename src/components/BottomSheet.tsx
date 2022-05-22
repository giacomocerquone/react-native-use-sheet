import { StyleSheet, Text, View } from 'react-native';
import React, { FunctionComponent } from 'react';
import { useBottomSheet } from './useBottomsheet';

const BottomSheet: FunctionComponent = () => {
  const value = useBottomSheet();

  return (
    <View>
      <Text>Bottomsheet</Text>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
