'use client'
import React from 'react';
import {Box, Flex, Text, Button} from '@chakra-ui/react';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import Link from 'next/link';

interface HeaderProps {
    isAuth: boolean;
}

const Header: React.FC<HeaderProps> = ({isAuth}: {isAuth: boolean}) => {

    const navigation = useRouter();

    const redirectToLogin = () => {
        navigation.push('/login');
    }

    const handleLogout = async () => {
        const response = await axios.delete(`${API_URL}/auth/logout`, {
            withCredentials: true,
        });
        console.log(response.status);
        window.location.href = '/';
        window.location.reload();
    }

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="#d3bda4" 
            color="white"
            className="header"
        >
            <Flex align="center" mr={5}>
                <Link href="/" style={{display: 'flex', alignItems: 'center'}}>
                <Box className="logo" mr="10px">
                    {/* Замените src на путь к вашему логотипу */}
                    <img src="/images/logo.jpg" alt="Logo" style={{width: '50px'}}/>
                </Box>
                <Text fontSize="xl" fontWeight="bold" fontFamily={"JetBrains Mono"} letterSpacing={2}>
                    ЧашкаКофе
                </Text>
                </Link>
            </Flex>

            <Box display="flex" alignItems="center">
                
                {isAuth === true ? <>
                    <Button
                variant="solid"
                backgroundColor="#8c756a" // темный кофейный цвет для кнопки
                color="white" // цвет текста
                _hover={{bg: "#6d5a50"}} // цвет при наведении
                size="md"
                mr={4}
                className="nav-button"
                onClick={() => navigation.push('/reservation')}
            >
                Забронировать столик
            </Button>
                    <Button
                variant="solid"
                backgroundColor="#8c756a" // темный кофейный цвет для кнопки
                color="white" // цвет текста
                _hover={{bg: "#6d5a50"}} // цвет при наведении
                size="md"
                mr={4}
                onClick={() => navigation.push('/reservation/myself')}
                className="nav-button"
            >
                Мои бронирования
            </Button>
                <Button
                    variant="outline"
                    borderColor="#8c756a" // граница кнопки
                    color="#8c756a" // цвет текста кнопки
                    _hover={{bg: "#6d5a50", color: "white"}} // цвет при наведении
                    size="md"
                    className="nav-button"
                    onClick={handleLogout}
                >
                    Выйти
                </Button>
                </> : <Button
                    variant="outline"
                    borderColor="#8c756a" // граница кнопки
                    color="#8c756a" // цвет текста кнопки
                    _hover={{bg: "#6d5a50", color: "white"}} // цвет при наведении
                    size="md"
                    className="nav-button"
                    onClick={redirectToLogin}
                >
                    Вход в аккаунт
                </Button>}
                
            </Box>
        </Flex>
    )
}

export default Header;
