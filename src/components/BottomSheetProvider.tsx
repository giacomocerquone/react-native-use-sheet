import * as React from 'react';
import {
  useCallback,
  useState,
  useMemo,
  FunctionComponent,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, useWindowDimensions } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  State,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import BottomSheet from './BottomSheet';
import { BottomSheetContext } from './useBottomSheet';

interface OpenSheetOptions {
  node: FunctionComponent<typeof scrollViewProps>;
  containerStyle?: ViewStyle;
}

export interface SheetContext {
  openSheet: ({ node }: OpenSheetOptions) => void;
  closeSheet: () => void;
  node?: FunctionComponent<typeof scrollViewProps>;
  rendered: boolean;
  visible: boolean;
  setRendered: (rendered: boolean) => void;
  opacity: Animated.Value;
  translateY: Animated.Value;
  height: number;
  panGestureRef: MutableRefObject<PanGestureHandler | undefined>;
  onSwipeDown: ({ nativeEvent }: PanGestureHandlerGestureEvent) => void;
  onGestureStateChange: ({
    nativeEvent,
  }: PanGestureHandlerStateChangeEvent) => void;
}

const PULL_DOWN_OFFSET = 80;

export const scrollViewProps = {};

export const BottomSheetProvider: FunctionComponent<{
  showHandle: boolean;
}> = ({ children }) => {
  // TODO showhandle
  const [state, setState] = useState<{
    node?: FunctionComponent<typeof scrollViewProps>;
    rendered: boolean;
    containerStyle?: ViewStyle;
  }>({ rendered: false });
  const [visible, setVisible] = useState(false);
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(height)).current;
  const panGestureRef = useRef();

  useEffect(() => {
    if (state.rendered) {
      setVisible(true);
    }
  }, [state.rendered]);

  const openSheet = useCallback(
    ({ node, containerStyle }: OpenSheetOptions) => {
      setState((s) => ({ ...s, rendered: true, node, containerStyle }));
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
      // if (!enabled) return;

      const { translationY } = nativeEvent;

      if (translationY > 0) {
        translateY.setValue(translationY);
        opacity.setValue(0.5 - translationY / 1000);
      }
    },
    [opacity, translateY]
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
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetContext.Provider value={providerValue}>
        {children}
        <BottomSheet style={state.containerStyle ?? {}}>
          {state.node && <state.node {...scrollViewProps} />}
        </BottomSheet>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
};

export default BottomSheetProvider;
