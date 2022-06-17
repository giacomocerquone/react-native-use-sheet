import * as React from 'react';
import {
  ReactNode,
  useCallback,
  useState,
  useMemo,
  createContext,
  useContext,
  FunctionComponent,
  useEffect,
} from 'react';
import type { ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from './BottomSheet';

const scrollViewProps = {};

interface OpenSheetOptions {
  node: FunctionComponent<typeof scrollViewProps>;
  containerStyle?: ViewStyle;
}

interface SheetContext {
  openSheet: ({ node }: OpenSheetOptions) => void;
  closeSheet: () => void;
  node?: FunctionComponent<typeof scrollViewProps>;
  rendered: boolean;
  visible: boolean;
  setRendered: (rendered: boolean) => void;
}

export const BottomSheetContext = createContext<SheetContext | undefined>(
  undefined
);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    node?: FunctionComponent<typeof scrollViewProps>;
    rendered: boolean;
    containerStyle?: ViewStyle;
  }>({ rendered: false });
  const [visible, setVisible] = useState(false);

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

  const providerValue = useMemo(() => {
    return {
      ...state,
      openSheet,
      closeSheet,
      visible,
      setRendered,
    };
  }, [closeSheet, openSheet, state, visible, setRendered]);

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

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <BottomSheetProvider>'
    );
  }

  return context;
};
