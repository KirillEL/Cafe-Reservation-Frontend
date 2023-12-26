'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios, { AxiosError } from 'axios';
import { API_URL } from '@/utils/constants';
import { useRouter } from 'next/navigation';



interface IUsers {
    id: number;
    login: string;
    email: string;
    password: string;
    role: string;
}

interface IAddUser {
    login: string;
    email: string;
    password: string;
    role: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<IUsers[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUsers | null>(null);
    const [editorUserId, setEditorUserId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<IAddUser>({
        login: '',
        email: '',
        password: '',
        role: ''
    });

    const router = useRouter();

    const handleDeleteUser = useCallback(async (userId: number) => {
        try {
        const response = await axios.delete(`${API_URL}/v1/user/delete/${userId}`, {
            withCredentials: true
        });
        if(response.status === 200) {
            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
    }, []);

    

    useEffect(() => {
       try {
            const fetchUsers = async () => {
                const response = await axios.get(`${API_URL}/v1/user/all`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                setUsers(response.data.data);
            
                
            }
            fetchUsers();
       } catch (error) {
            const e = error as AxiosError;
            if(e?.response?.status === 401) {
                window.location.href = '/login';
            }
       }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.delete(`${API_URL}/auth/logout`, {withCredentials: true});
            if(response.status === 200) window.location.reload();
          } catch (error) {
            alert(error);
          }
    }

    const handleModal = () => onOpen();

    const openEditModal = (user: IUsers) => {
        setEditingUser(user);
        setEditorUserId(user.id);
        setIsEditModalOpen(true);
      };
    
    const handleAddUser = async () => {
        try {
            const data = {
                "login": selectedUser.login.toString(),
                "email": selectedUser.email.toString(),
                "password": selectedUser.password.toString(),
                "role": selectedUser.role.toString()
            }
            const response = await axios.post(`${API_URL}/v1/user/create`,data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(response.status === 200) window.location.reload();
        } catch (error) {
            const e = error as AxiosError;
            alert(e);
        }
    }
 
    const handleEditSaveUser = async () => {
        try {
            if(editingUser && editorUserId) {
                const response = await axios.put(`${API_URL}/v1/user/update/${editorUserId}`, editingUser, {headers: {'Content-Type': 'application/json'}, withCredentials: true});
                if(response.status === 200) window.location.reload();
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" p={4}>
                <Heading as="h2" size="lg">Пользователи</Heading>
                <Button colorScheme="blue" onClick={handleModal}>Добавить пользователя</Button>
                <Button colorScheme="teal" onClick={() => router.push('/admin')}>Назад</Button>
                <Button colorScheme="red" onClick={handleLogout}>Выйти</Button>
            </Flex>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Login</Th>
                        <Th>Password</Th>
                        <Th>Role</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users?.map((user) => (
                        <Tr key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.login}</Td>
                            <Td>{user.password}</Td>
                            <Td>{user.role}</Td>
                            <Td>
                                <IconButton aria-label="Edit" icon={<EditIcon />} onClick={() => openEditModal(user)} />
                                <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => handleDeleteUser(user.id)} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Добавление пользователя</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <FormControl>
                <FormLabel>Login</FormLabel>
                <Input
                    value={selectedUser.login}
                    onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        login: e.target.value
                    })} />
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                    value={selectedUser.password}
                    onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})} />
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Role</FormLabel>
                <Input
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                />
            </FormControl>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddUser}>
                Сохранить
            </Button>
            <Button variant="ghost" onClick={onClose}>
                Отмена
            </Button>
        </ModalFooter>
    </ModalContent>
</Modal>


<Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Редактирование пользователя</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
  <FormControl>
    <FormLabel>Login</FormLabel>
    <Input
      value={editingUser?.login || ''}
      onChange={(e) => {
        setEditingUser({
          ...editingUser!,
          login: e.target.value,
        });
      }}
    />
  </FormControl>
  <FormControl mt={4}>
    <FormLabel>Password</FormLabel>
    <Input
      value={editingUser?.password || ''}
      onChange={(e) => {
        setEditingUser({
          ...editingUser!,
          password: e.target.value,
        });
      }}
    />
  </FormControl>
  <FormControl mt={4}>
    <FormLabel>Email</FormLabel>
    <Input
      value={editingUser?.email || ''}
      onChange={(e) => {
        setEditingUser({
          ...editingUser!,
          email: e.target.value,
        });
      }}
    />
  </FormControl>
  <FormControl mt={4}>
    <FormLabel>Role</FormLabel>
    <Input
      value={editingUser?.role || ''}
      onChange={(e) => {
        setEditingUser({
          ...editingUser!,
          role: e.target.value,
        });
      }}
    />
  </FormControl>
</ModalBody>

    <ModalFooter>
      <Button
        colorScheme="blue"
        mr={3}
        onClick={() => {
            handleEditSaveUser();
            setIsEditModalOpen(false);
        }}
      >
        Сохранить
      </Button>
      <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
        Отмена
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

        </Box>
    )
}

export default AdminUsersPage;
