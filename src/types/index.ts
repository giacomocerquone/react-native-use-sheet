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

type Content = (
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

type Mode = 'sheet' | 'modal';

export interface SheetOptions {
  content?: Content;
  containerStyle?: ViewStyle;
  mode?: Mode;
}

export interface SheetState {
  content?: Content;
  rendered: boolean;
  containerStyle?: ViewStyle;
  mode: Mode;
}

export interface ISheetContext extends SheetState {
  openSheet: ({ content }: SheetOptions) => void;
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
