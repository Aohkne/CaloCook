import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const toggleTheme = () => {
    document.body.classList.toggle('dark');
  };

  return <ThemeContext.Provider value={{ toggleTheme }}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
