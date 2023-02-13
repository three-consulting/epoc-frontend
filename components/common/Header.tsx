import React from "react"
import {
    Box,
    ChakraProvider,
    extendTheme,
    Flex,
    Heading,
    StyleConfig,
} from "@chakra-ui/react"

const components: Record<string, StyleConfig> = {
    Heading: {
        baseStyle: {
            paddingX: "2rem",
            paddingY: "1rem",
            color: "whitesmoke",
        },
        variants: {
            topHeader: {
                paddingY: "1.5rem",
                color: "black",
                bg: "whitesmoke",
            },
            mainHeader: {
                bg: "black",
            },
            subHeader: {
                bg: "#6f6f6f",
            },
            elementHeader: {
                bg: "#6f6f6f",
                paddingX: "1.5rem",
            },
            tableHeader: {
                bg: "#6f6f6f",
                paddingX: "1.5rem",
                _hover: { cursor: "pointer" },
            },
        },
        defaultProps: {
            size: "md",
        },
    },
}

const StyledItems = ({ children }: { children: JSX.Element }) => (
    <ChakraProvider theme={extendTheme({ components })}>
        {children}
    </ChakraProvider>
)

type TContent = JSX.Element | Array<JSX.Element> | string
type THeaderType = "top" | "main" | "sub" | "element"

interface IHeader {
    type: THeaderType
    children?: TContent
}

const Header = ({ children, type }: IHeader) => {
    let variant: THeaderType = "top"
    let size = "3xl"
    switch (type) {
        case "main": {
            variant = type
            size = "xl"
            break
        }
        case "sub": {
            variant = type
            size = "md"
            break
        }
        case "element": {
            variant = type
            size = "sm"
            break
        }
        default: {
            break
        }
    }
    return (
        <StyledItems>
            <Heading variant={`${variant}Header`} size={size}>
                {children ?? "[...] - Epoc"}
            </Heading>
        </StyledItems>
    )
}

export const TableHeader = ({
    text,
    icon,
    onClick,
}: {
    text: string
    icon?: JSX.Element
    onClick?: () => void
}) => (
    <StyledItems>
        <Heading as="h4" variant="tableHeader" size="sm" onClick={onClick}>
            <Flex justifyContent="space-between" alignItems="center">
                <Box>{text}</Box>
                <Box>{icon}</Box>
            </Flex>
        </Heading>
    </StyledItems>
)

export default Header
