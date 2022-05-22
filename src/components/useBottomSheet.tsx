import * as React from 'react';
import {
  ReactNode,
  useCallback,
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from './BottomSheet';

export const BottomSheetContext = createContext<IToastContext | undefined>(
  undefined
);

const scrollViewProps = {};

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    children?: ReactNode;
  }>();

  const providerValue = useMemo(() => {
    return { hideToast, showToast, ...state };
  }, [showToast, state, hideToast]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetContext.Provider value={providerValue}>
        {children}
        <BottomSheet>
          {typeof state?.children === 'function'
            ? state.children(scrollViewProps)
            : state?.children}
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
