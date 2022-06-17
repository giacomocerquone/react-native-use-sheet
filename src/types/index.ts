import type React from 'react';
import type { ComponentProps, MutableRefObject, ReactElement } from 'react';
import type {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import type {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  ScrollView,
} from 'react-native-gesture-handler';

export interface HookOptions {
  mode: 'modal' | 'sheet';
}

export type contentType = (
  props:
    | {
        onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        ref: React.MutableRefObject<any>;
        scrollEventThrottle: ComponentProps<
          typeof ScrollView
        >['scrollEventThrottle']; // If not set, the onScroll handler will fire only once on web
        waitFor: React.MutableRefObject<any>;
      }
    | {}
) => ReactElement;

export interface OpenSheetOptions {
  content?: contentType;
  containerStyle?: ViewStyle;
}

export interface SheetState {
  content?: contentType;
  rendered: boolean;
  containerStyle?: ViewStyle;
  mode: 'sheet' | 'modal';
}

export interface SheetContext extends SheetState {
  openSheet: ({ content }: OpenSheetOptions) => void;
  closeSheet: () => void;
  visible: boolean;
  opacity: Animated.Value;
  translateY: Animated.Value;
  height: number;
  panGestureRef: MutableRefObject<PanGestureHandler | undefined>;
  onSwipeDown: ({ nativeEvent }: PanGestureHandlerGestureEvent) => void;
  onGestureStateChange: ({
    nativeEvent,
  }: PanGestureHandlerStateChangeEvent) => void;
  enabled: boolean;
  setState: React.Dispatch<React.SetStateAction<SheetState>>;
}
