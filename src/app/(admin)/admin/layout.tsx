'use client'
import React, { useEffect, useState } from 'react';
import {Box, Container, Flex, Spinner, Text, useColorModeValue} from '@chakra-ui/react';
import Head from 'next/head';
import {Metadata} from "next";
import axios, { AxiosError } from 'axios';
import { API_URL } from '@/utils/constants';
import { useRouter } from 'next/navigation';

const metadata: Metadata = {
    title: 'Adminka',
    description: 'Generated by create next app',
}

const AdminLayout = ({children}: { children: React.ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const checkRoleHandler = async () => {
            try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/auth/verify`, {withCredentials: true});
            if(response.status === 200 && response.data && response.data.claims.role === "admin") {
                setIsAdmin(true);
                return;
            } else {
                router.push('/');
                setIsAdmin(false);
                return;
                
            }
        } catch (error) {
            const e = error as AxiosError;
            if(e?.response?.status === 401) {
                router.push('/login');
                return;
            }
        }
        }
        checkRoleHandler();
        setIsLoading(false);
    
    },[]);

    if(isLoading) {
        return <Spinner/>
    }

    if(!isLoading) {
        if(!isAdmin) {
            return (<>
                <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="100%"
                            flexDirection="column"
                        >
                            <Text fontSize="2xl" fontWeight="bold" fontFamily={"JetBrains Mono"} letterSpacing={2}>
                                Вы не админ
                            </Text>
                        </Box>
            </>)
        } else {
            return (
                <>
                    <Head>
                        <title>Adminka</title>
                        <meta name="description" content="Generated by create next app"/>
                        <meta charSet="UTF-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    </Head>
                    <Container bg={'#f0e6d6'} color={'#5c5346'} width={"100%"} maxW="100%" minH="100vh" >
                        {/* <Flex direction="column" align="center" mt={-20} pb={10}>
                            <Box className="logo" mb="10px">
                                <img src="/images/logo.jpg" alt="Logo" style={{width: '100px'}}/>
                            </Box>
                            <Text fontSize="2xl" fontWeight="bold" fontFamily={"JetBrains Mono"} letterSpacing={2}>
                                ЧашкаКофе
                            </Text>
                        </Flex> */}
                        {children}
                    </Container>
                </>
            );
        }
        
    }

    if(!isLoading && isAdmin) {
        
    }

    
};

export default AdminLayout;
