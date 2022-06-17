import type {
  ComponentProps,
  FunctionComponent,
  MutableRefObject,
} from 'react';
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

export type nodeType = FunctionComponent<{
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef: React.MutableRefObject<any>;
  scrollEventThrottle: ComponentProps<typeof ScrollView>['scrollEventThrottle']; // If not set, the onScroll handler will fire only once on web
  waitFor: React.MutableRefObject<any>;
}>;

export interface OpenSheetOptions {
  node: nodeType;
  containerStyle?: ViewStyle;
}

export interface SheetContext {
  openSheet: ({ node }: OpenSheetOptions) => void;
  closeSheet: () => void;
  node?: nodeType;
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
  enabled: boolean;
}
