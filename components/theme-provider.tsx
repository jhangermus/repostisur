<<<<<<< HEAD
'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
=======
"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
>>>>>>> dev

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
