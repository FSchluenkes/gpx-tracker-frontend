"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProviderProps } from "next-themes/dist/types";

export const Provider = ({ children }: ThemeProviderProps) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
};
