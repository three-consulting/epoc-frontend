import React, { ReactNode, useState } from "react"
import Header from "./Header"
import Main from "./Main"
import { Flex, Icon, useMediaQuery } from "@chakra-ui/react"
import { BsList } from "react-icons/bs"

interface LayoutProps {
    children?: ReactNode
}

const Layout = (props: LayoutProps): JSX.Element => {
    const { children } = props
    const [isLarge] = useMediaQuery("(min-width: 800px)")
    const [showNavigations, setShowNavigations] = useState<boolean>(false)

    return (
        <>
            {isLarge ? (
                <Flex
                    flexDirection="column"
                    minHeight="100vh"
                    background="linear-gradient(#9f9f9f, #efefef)"
                >
                    <Header type="top" />
                    <Main>{children}</Main>
                </Flex>
            ) : (
                <Flex
                    flexDirection="column"
                    width="100%"
                    height="100%"
                    backgroundColor="black"
                >
                    <Header
                        type="mobile"
                        menu={
                            <Icon
                                as={BsList}
                                onClick={() =>
                                    setShowNavigations((show) => !show)
                                }
                            />
                        }
                    />
                    <Main showNavigations={showNavigations}>{children}</Main>
                </Flex>
            )}
        </>
    )
}

export default Layout
