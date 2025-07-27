import { createContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from './AuthContext';

export const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  let user, meta, setMeta;
  try {
    const auth = useAuth();
    user = auth.user;
    meta = auth.meta;
    setMeta = auth.setMeta;
  } catch (err) {
    user = null;
    meta = {};
    setMeta = () => {};
  }

  // Load from localStorage or meta
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const preferred = stored || (meta?.theme || 'light');
    setMode(preferred);
  }, [meta]);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);

    if (user && setMeta) {
      setMeta((prev) => ({ ...prev, theme: newMode }));
    }
  };

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
