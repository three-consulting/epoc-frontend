import React, { ReactNode } from 'react';
import Header from '@/components/Header/index';
import Footer from '@/components/Footer/index';
import Main from '@/components/Main/index';
import { Flex } from '@chakra-ui/react';

interface LayoutProps {
    children?: ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <Flex flexDirection="column" minHeight="100vh" backgroundColor="#efefef">
            <Header></Header>
            <Main>{children}</Main>
            <Footer></Footer>
        </Flex>
    );
}

export default Layout;
