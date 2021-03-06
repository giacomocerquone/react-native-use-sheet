import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import React, { FunctionComponent, useEffect } from 'react';
import { useSheet } from './useSheet';
import { PanGestureHandler } from 'react-native-gesture-handler';
import useKHeight from '../hooks/useKHeight';

const Handle = () => <View style={styles.handle} />;

const Sheet: FunctionComponent<{
  style: ViewStyle;
}> = ({ style, children }) => {
  const {
    visible,
    rendered,
    closeSheet,
    opacity,
    translateY,
    height,
    panGestureRef,
    onSwipeDown,
    onGestureStateChange,
    enabled,
    setState,
  } = useSheet();
  const kHeight = useKHeight();

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
    } else if (rendered === true) {
      // means visible === false and rendered === true
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
        setState((s) => ({ ...s, rendered: false }));
      });
    }
  }, [height, opacity, visible, translateY, closeSheet, setState, rendered]);

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
      <PanGestureHandler
        onHandlerStateChange={onGestureStateChange}
        enabled={enabled}
        ref={panGestureRef}
        activeOffsetY={5}
        failOffsetY={-5}
        onGestureEvent={onSwipeDown}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              maxHeight: (height / 100) * 90,
              paddingBottom: kHeight + 24,
            },
            style,
          ]}
        >
          <Handle />
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Sheet;

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
  handle: {
    marginBottom: 12,
    width: 32,
    alignSelf: 'center',
    height: 4,
    borderRadius: 12,
    borderColor: 'grey',
    backgroundColor: 'grey',
  },
});
