import { createContext, useContext } from 'react';

export type ArcFiThemeMode = 'dark' | 'light';

export type ArcFiThemeContextValue = {
  mode: ArcFiThemeMode;
  isDark: boolean;
  toggleMode: () => void;
};

export const ArcFiThemeContext = createContext<ArcFiThemeContextValue | null>(null);

export const useArcFiTheme = () => {
  const context = useContext(ArcFiThemeContext);
  if (!context) {
    throw new Error('useArcFiTheme must be used within ArcFiThemeContext.Provider');
  }
  return context;
};
