'use client'

import { ChakraProvider } from "@chakra-ui/react"

export function ChProvider({children}: {children: React.ReactNode}) {
    return <ChakraProvider>{children}</ChakraProvider>
}