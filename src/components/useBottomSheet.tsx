import { createContext, useContext, useEffect } from 'react';
import type { SheetOptions, SheetContext } from 'src/types';

export const BottomSheetContext = createContext<SheetContext | undefined>(
  undefined
);

export const useBottomSheet = ({
  content,
  containerStyle,
  mode,
}: SheetOptions = {}) => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <BottomSheetProvider>'
    );
  }

  const { setState } = context;

  useEffect(() => {
    setState((s) => {
      const newState = { ...s };

      if (content) {
        newState.content = content;
      }
      if (mode) {
        newState.mode = mode;
      }
      if (containerStyle) {
        newState.containerStyle = containerStyle;
      }

      return newState;
    });
  }, [containerStyle, content, mode, setState]);

  return context;
};
