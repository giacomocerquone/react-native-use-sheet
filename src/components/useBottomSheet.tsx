import { createContext, useContext, useEffect } from 'react';
import type { contentType, HookOptions, SheetContext } from 'src/types';

export const BottomSheetContext = createContext<SheetContext | undefined>(
  undefined
);

export const useBottomSheet = (
  content?: contentType,
  { mode }: HookOptions = { mode: 'modal' }
) => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <BottomSheetProvider>'
    );
  }

  const { setState } = context;

  useEffect(() => {
    if (content) {
      setState((s) => ({ ...s, content, mode }));
    }
  }, [content, mode, setState]);

  return context;
};
