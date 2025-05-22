// app/ThemeWrapper.tsx
"use client";

import { ThemeProvider } from "styled-components";
import { ThemeProviderCustom, useTheme } from "@/context/ThemeContext";
import GlobalStyle from "@/styles/GlobalStyle";

function Inner({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProviderCustom>
      <Inner>{children}</Inner>
    </ThemeProviderCustom>
  );
}
