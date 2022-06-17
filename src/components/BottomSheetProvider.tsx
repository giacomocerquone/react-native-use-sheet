import * as React from 'react';
import {
  useCallback,
  useState,
  useMemo,
  FunctionComponent,
  useEffect,
  useRef,
} from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import { Animated, useWindowDimensions } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import type { nodeType, OpenSheetOptions } from 'src/types';
import BottomSheet from './BottomSheet';
import { BottomSheetContext } from './useBottomSheet';

const PULL_DOWN_OFFSET = 80;

export const BottomSheetProvider: FunctionComponent<{
  showHandle: boolean;
}> = ({ children }) => {
  // TODO showhandle
  const [state, setState] = useState<{
    content?: nodeType;
    rendered: boolean;
    containerStyle?: ViewStyle;
  }>({ rendered: false });
  const [visible, setVisible] = useState(false);
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height)).current;
  const panGestureRef = useRef();
  const scrollRef = useRef();
  const [enabled, setEnabled] = useState(true);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (nativeEvent.contentOffset.y <= 0 && !enabled) {
      setEnabled(true);
    }

    if (nativeEvent.contentOffset.y > 0 && enabled) {
      setEnabled(false);
    }
  };

  const scrollViewProps = {
    onScroll,
    ref: scrollRef,
    scrollEventThrottle: 16, // If not set, the onScroll handler will fire only once on web
    waitFor: enabled ? panGestureRef : scrollRef,
  };

  useEffect(() => {
    if (state.rendered) {
      setVisible(true);
    }
  }, [state.rendered]);

  const openSheet = useCallback(
    ({ content, containerStyle }: OpenSheetOptions) => {
      setState((s) => ({ ...s, rendered: true, content, containerStyle }));
    },
    []
  );

  const closeSheet = useCallback(() => {
    setVisible(false);
  }, []);

  const setRendered = useCallback((rendered: boolean) => {
    setState((s) => ({ ...s, rendered }));
  }, []);

  const onSwipeDown = useCallback(
    ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
      if (!enabled) return;

      const { translationY } = nativeEvent;

      if (translationY > 0) {
        translateY.setValue(translationY);
        opacity.setValue(0.5 - translationY / 1000);
      }
    },
    [enabled, opacity, translateY]
  );

  const onGestureStateChange = useCallback(
    ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
      const { state: animationState, translationY } = nativeEvent;

      if (animationState === State.END) {
        if (translationY <= PULL_DOWN_OFFSET) {
          Animated.parallel([
            Animated.timing(opacity, {
              duration: 100,
              toValue: 0.5,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              duration: 100,
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        } else if (translationY > PULL_DOWN_OFFSET) {
          closeSheet();
        }
      }
    },
    [closeSheet, opacity, translateY]
  );

  const providerValue = useMemo(() => {
    return {
      ...state,
      openSheet,
      closeSheet,
      visible,
      setRendered,
      opacity,
      translateY,
      height,
      panGestureRef,
      onSwipeDown,
      onGestureStateChange,
      enabled,
    };
  }, [
    state,
    openSheet,
    closeSheet,
    visible,
    setRendered,
    opacity,
    translateY,
    height,
    panGestureRef,
    onSwipeDown,
    onGestureStateChange,
    enabled,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetContext.Provider value={providerValue}>
        {children}
        <BottomSheet style={state.containerStyle ?? {}}>
          {state.content && state.content(scrollViewProps ?? {})}
        </BottomSheet>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
};

export default BottomSheetProvider;
