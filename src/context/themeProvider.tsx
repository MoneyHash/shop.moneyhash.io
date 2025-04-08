import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme === 'system' || !storedTheme) {
      return defaultTheme === 'system' ? getSystemTheme() : defaultTheme;
    }
    return storedTheme;
  });

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (internalTheme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setInternalTheme(newTheme);
        updateRootClassName(newTheme);
      }
    };

    const systemThemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

    updateRootClassName(internalTheme);

    return () => {
      systemThemeMediaQuery.removeEventListener(
        'change',
        handleSystemThemeChange,
      );
    };
  }, [internalTheme]);

  const value = useMemo(
    () => ({
      theme: internalTheme,
      setTheme(theme: Theme) {
        if (theme === 'system') {
          const systemTheme = getSystemTheme();
          updateRootClassName(systemTheme);
          setInternalTheme(systemTheme);
        } else {
          updateRootClassName(theme);
          setInternalTheme(theme);
        }
        localStorage.setItem(storageKey, theme);
      },
    }),
    [internalTheme, storageKey],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

function updateRootClassName(theme: Theme) {
  const root = window.document.documentElement;

  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}
