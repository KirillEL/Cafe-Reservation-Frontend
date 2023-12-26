'use client'
import React from 'react';
import { Box, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Button, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

const AdminPage: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    const navigateToTable = (table: string) => {
        router.push(`/admin/${table}`); 
    };

    return (
        <Box>
            <Flex bg="gray.100" p={4} justifyContent="space-between" alignItems="center">
                <Heading as="h1" size="lg" letterSpacing={"tighter"}>Администрирование Чашка Кофе</Heading>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Таблицы
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => navigateToTable('tables')}>Tables</MenuItem>
                        <MenuItem onClick={() => navigateToTable('customers')}>Customers</MenuItem>
                        <MenuItem onClick={() => navigateToTable('reservations')}>Reservations</MenuItem>
                        <MenuItem onClick={() => navigateToTable('users')}>Users</MenuItem>
                    </MenuList>
                </Menu>
                <Button colorScheme="red" onClick={handleLogout}>Выйти</Button>
            </Flex>
            <Flex p={5} direction="column" gap={4}>
                <Box bg="white" p={6} rounded="md" shadow="md">
                    <Heading size="md" mb={4}>Tables</Heading>
                    <Text>Список всех столиков в заведении с информацией о номере, количестве мест и местоположении.</Text>
                    {/* Дополнительный компонент для управления данными о столиках */}
                </Box>

                <Box bg="white" p={6} rounded="md" shadow="md">
                    <Heading size="md" mb={4}>Customers</Heading>
                    <Text>Информация о клиентах, включая их имя, контакты и привязанные бронирования.</Text>
                    {/* Компонент для управления клиентами */}
                </Box>

                <Box bg="white" p={6} rounded="md" shadow="md">
                    <Heading size="md" mb={4}>Reservations</Heading>
                    <Text>Список всех бронирований с информацией о клиенте, столике, времени и статусе.</Text>
                    {/* Компонент для управления бронированиями */}
                </Box>

                <Box bg="white" p={6} rounded="md" shadow="md">
                    <Heading size="md" mb={4}>Users</Heading>
                    <Text>Управление пользователями системы, включая администраторов и клиентов.</Text>
                    {/* Компонент для управления пользователями */}
                </Box>
            </Flex>
        </Box>
    )
}

export default AdminPage;
