import * as React from 'react';
import {
  useCallback,
  useState,
  useMemo,
  FunctionComponent,
  useEffect,
  useRef,
} from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated, useWindowDimensions } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import type { SheetOptions, SheetState } from 'src/types';
import BottomSheet from './BottomSheet';
import { BottomSheetContext } from './useBottomSheet';

// TODO should be a third of the bottomsheet's height
const PULL_DOWN_OFFSET = 80;

export const BottomSheetProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState<SheetState>({
    rendered: false,
    mode: 'modal',
  });
  const [visible, setVisible] = useState(false);
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height)).current;
  const panGestureRef = useRef();
  const scrollRef = useRef();
  const [enabled, setEnabled] = useState(true);

  // TODO implement mode

  // useEffect(() => {
  //   if (state.mode === 'sheet') {
  //     opacity.setValue(1);
  //     translateY.setValue(height - (height / 100) * 15);
  //     setVisible(true), setState((s) => ({ ...s, rendered: true }));
  //   }
  // }, [height, opacity, state.mode, translateY]);

  const scrollViewProps = useMemo(
    () => ({
      onScroll: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (nativeEvent.contentOffset.y <= 0 && !enabled) {
          setEnabled(true);
        }

        if (nativeEvent.contentOffset.y > 0 && enabled) {
          setEnabled(false);
        }
      },
      ref: scrollRef,
      scrollEventThrottle: 16,
      waitFor: enabled ? panGestureRef : scrollRef,
    }),
    [enabled]
  );

  useEffect(() => {
    if (state.rendered) {
      setVisible(true);
    }
  }, [state.rendered]);

  const openSheet = useCallback(
    ({ content, containerStyle, mode }: SheetOptions = {}) => {
      setState((s) => {
        return {
          ...s,
          rendered: true,
          ...(content && { content }),
          ...(mode && { mode }),
          ...(containerStyle && { containerStyle }),
        };
      });
    },
    []
  );

  const closeSheet = useCallback(() => {
    setVisible(false);
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
      opacity,
      translateY,
      height,
      panGestureRef,
      onSwipeDown,
      onGestureStateChange,
      enabled,
      setState,
    };
  }, [
    state,
    openSheet,
    closeSheet,
    visible,
    opacity,
    translateY,
    height,
    panGestureRef,
    onSwipeDown,
    onGestureStateChange,
    enabled,
    setState,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetContext.Provider value={providerValue}>
        {children}
        <BottomSheet style={state.containerStyle ?? {}}>
          {state.content && <state.content {...scrollViewProps} />}
        </BottomSheet>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
};

export default BottomSheetProvider;
