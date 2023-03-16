import {
    Button,
    ButtonProps,
    ChakraProvider,
    extendTheme,
    Icon,
    IconButton,
    IconButtonProps,
    StyleConfig,
} from "@chakra-ui/react"
import React from "react"
import { IconType } from "react-icons"
import { BsSortNumericDown, BsSortNumericDownAlt, BsX } from "react-icons/bs"

const capitalize = (input: string): string =>
    input.charAt(0).toUpperCase() + input.slice(1)

const components: Record<string, StyleConfig> = {
    Button: {
        baseStyle: {
            borderRadius: "0",
        },
        defaultProps: {},
    },
    IconButton: {
        baseStyle: {
            borderRadius: "0",
        },
        defaultProps: {},
    },
}

type TButtonType =
    | "confirm"
    | "add"
    | "edit"
    | "submit"
    | "save"
    | "cancel"
    | "custom"
type TButtonInput = [ButtonProps["colorScheme"], ButtonProps["variant"]]

interface IStyledButton extends ButtonProps {
    buttontype: TButtonType
    name?: string
}

export const StyledButton = (props: IStyledButton) => {
    const { buttontype, name, children } = props

    const content = capitalize(buttontype)
    let [colorScheme, variant]: TButtonInput = ["blue", "solid"]

    switch (buttontype) {
        case "confirm": {
            colorScheme = "green"
            break
        }
        case "cancel": {
            colorScheme = "red"
            variant = "outline"
            break
        }
        default: {
            break
        }
    }
    return (
        <ChakraProvider theme={extendTheme({ components })}>
            <Button colorScheme={colorScheme} variant={variant} {...props}>
                {`${children ?? content}${name ? " ".concat(name) : ""}`}
            </Button>
        </ChakraProvider>
    )
}

interface ICustomButton extends ButtonProps {
    text?: string
    name?: string
}

export const CustomButton = (props: ICustomButton): JSX.Element => {
    const { text, name } = props
    return (
        <StyledButton {...props} buttontype="custom">
            {`${text ? text : ""}${name ? " ".concat(name) : ""}`}
        </StyledButton>
    )
}

interface IStyledIconButton extends IconButtonProps {
    iconType: IconType
    hoverOver?: boolean
}

const StyledIconButton = (props: IStyledIconButton): JSX.Element => {
    const { hoverOver, iconType, ...rest } = props
    return (
        <ChakraProvider theme={extendTheme({ components })}>
            <IconButton
                icon={<Icon as={iconType} boxSize="1.5rem" />}
                _hover={
                    hoverOver
                        ? {
                              color: props.backgroundColor,
                              backgroundColor: props.color,
                          }
                        : {}
                }
                {...rest}
            >
                {props.children}
            </IconButton>
        </ChakraProvider>
    )
}

export const RemoveIconButton = (props: IconButtonProps): JSX.Element => (
    <StyledIconButton
        {...props}
        color="whitesmoke"
        backgroundColor="#6f6f6f"
        iconType={BsX}
        hoverOver={true}
    />
)

interface ISortingOrderIconButton extends IconButtonProps {
    oldestFirst: boolean
}

export const SortingOrderIconButton = (
    props: ISortingOrderIconButton
): JSX.Element => {
    const { oldestFirst, ...rest } = props
    return (
        <StyledIconButton
            {...rest}
            color="whitesmoke"
            backgroundColor="#6f6f6f"
            iconType={oldestFirst ? BsSortNumericDown : BsSortNumericDownAlt}
            hoverOver={true}
        />
    )
}
