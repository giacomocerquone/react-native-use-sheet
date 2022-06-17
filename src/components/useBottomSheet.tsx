import { createContext, useContext } from 'react';
import type { SheetContext } from 'src/types';

export const BottomSheetContext = createContext<SheetContext | undefined>(
  undefined
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <BottomSheetProvider>'
    );
  }

  return context;
};
