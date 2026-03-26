import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
