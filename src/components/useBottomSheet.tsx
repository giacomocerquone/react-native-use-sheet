import { createContext, useContext, useEffect } from 'react';
import type { SheetOptions, SheetContext } from 'src/types';

export const BottomSheetContext = createContext<SheetContext | undefined>(
  undefined
);

export const useBottomSheet = (
  { content, containerStyle, mode }: SheetOptions = { mode: 'sheet' }
) => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <BottomSheetProvider>'
    );
  }

  const { setState } = context;

  useEffect(() => {
    setState((s) => {
      return {
        ...s,
        ...(content && { content }),
        ...(mode && { mode }),
        ...(containerStyle && { containerStyle }),
      };
    });
  }, [containerStyle, content, mode, setState]);

  return context;
};
