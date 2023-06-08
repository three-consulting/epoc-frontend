import React, { createContext, ReactNode } from "react"
import { useMediaQuery } from "@chakra-ui/react"

interface MediaState {
    isLarge: boolean
}

export const MediaContext = createContext<MediaState>({} as MediaState)

interface MediaProps {
    children: ReactNode
}

export const MediaProvider = ({ children }: MediaProps): JSX.Element => {
    const [isLarge] = useMediaQuery("(min-width: 900px)")

    return (
        <MediaContext.Provider value={{ isLarge }}>
            {children}
        </MediaContext.Provider>
    )
}
