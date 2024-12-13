"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { ReactNode } from "react";

interface ProviderProps extends ColorModeProviderProps {
  children: ReactNode;
}

export function Provider({ children, ...props }: ProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
