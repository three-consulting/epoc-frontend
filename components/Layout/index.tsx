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
        <Flex flexDirection="column" height="100vh" backgroundColor="#f9f6ef">
            <Header></Header>
            <Main>{children}</Main>
            <Footer></Footer>
        </Flex>
    );
}

export default Layout;
