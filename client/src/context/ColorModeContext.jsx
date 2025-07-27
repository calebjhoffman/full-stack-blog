import { createContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // ✅ Load from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem('theme_preference');
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme_preference', newMode);
  };

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, setMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
