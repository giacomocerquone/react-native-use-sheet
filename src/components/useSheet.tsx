import { createContext, useContext, useEffect } from 'react';
import type { SheetOptions, ISheetContext } from 'src/types';

export const SheetContext = createContext<ISheetContext | undefined>(undefined);

export const useSheet = (
  { content, containerStyle, mode }: SheetOptions = { mode: 'sheet' }
) => {
  const context = useContext(SheetContext);

  if (!context) {
    throw new Error(
      'Error: could not find toast context value; please ensure the component is wrapped in a <SheetProvider>'
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
