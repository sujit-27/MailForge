import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark', 'classic-dark');
    
    if (currentTheme === 'light') {
      root.classList.remove('dark');
    } else if (currentTheme === 'classic-dark') {
      root.classList.add('dark', 'classic-dark');
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '120 100% 90%');
      root.style.setProperty('--primary', '120 100% 50%');
      root.style.setProperty('--card', '0 0% 5%');
    } else {
      root.classList.add('dark');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--card');
    }
  }, [currentTheme]);

  return children;
}
