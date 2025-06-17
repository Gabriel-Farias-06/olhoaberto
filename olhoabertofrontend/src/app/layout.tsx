"use client";

// layout.tsx
import ThemeWrapper from "./ThemeWrapper";

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
