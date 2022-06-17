import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
} from 'react-native';
import React, { FunctionComponent, ReactNode, useEffect, useRef } from 'react';
import { useBottomSheet } from './useBottomSheet';

const BottomSheet: FunctionComponent<{
  style: ViewStyle;
  children: ReactNode;
}> = ({ style, children }) => {
  const { visible, rendered, closeSheet, setRendered } = useBottomSheet();
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRendered(false);
      });
    }
  }, [height, opacity, visible, translateY, closeSheet, setRendered]);

  if (!rendered) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, { opacity }]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {/* TODO */}
        {children as any}
      </Animated.View>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: { backgroundColor: '#000' },
  sheet: {
    backgroundColor: '#fff',
    padding: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
  },
});
