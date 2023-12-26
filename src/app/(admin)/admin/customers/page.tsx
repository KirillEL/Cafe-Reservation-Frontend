'use client'
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { API_URL } from '@/utils/constants';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

interface ICustomers {
    id: number;
    user_id: number;
    name: string;
    phone: number;
    email: string;
}

interface IAddCustomer {
    user_id: number;
    name: string;
    phone: number;
    email: string;
}

interface IUsers {
  id: number;
  login: string;
  email: string;
  password: string;
  role: string;
}

const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomers[] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<IUsers[] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editorCustomerId, setEditorCustomerId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<IAddCustomer | null>(null);
  const [newCustomer, setNewCustomer] = useState<IAddCustomer>({
    user_id: 0,
    name: '',
    phone: 0,
    email: ''
  });

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_URL}/v1/customer/all`, {withCredentials: true}); 
        setCustomers(response.data.data);
      } catch (error) {
        const e = error as AxiosError;
        if(e?.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setNewCustomer({
      user_id: 0,
      name: '',
      phone: 0,
      email: '',
    });
    onOpen();
  };

  const handleEditCustomer = (customer: IAddCustomer) => {
    setNewCustomer(customer);
    onOpen();
  };
  const openEditCustomerModal = (customer: ICustomers) => {
    setEditingCustomer(customer);
    setEditorCustomerId(customer.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
    const response = await axios.delete(`${API_URL}/v1/customer/delete/${customerId}`, {withCredentials: true});
    if(response.status === 200) {
        window.location.reload();
    }
    } catch (error) {
        alert(error);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      console.log(newCustomer);
      const response = await axios.post(`${API_URL}/v1/customer/create`, newCustomer, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if(response.status === 200) window.location.reload();
    } catch (error) {
      alert(error);
    }
  }


  const handleEditSaveUser = async () => {
    try {
      if(editingCustomer && editorCustomerId) {
        const response = await axios.put(`${API_URL}/v1/customer/update/${editorCustomerId}`,editingCustomer, {headers: {'Content-Type': 'application/json'}, withCredentials: true});
        if(response.status === 200) window.location.reload();
      }
    } catch (error) {
      const e = error as AxiosError;
      alert(e);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`${API_URL}/auth/logout`, {withCredentials: true});
      if(response.status === 200) window.location.reload();
    } catch (error) {
      alert(error);
    }
  }

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

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Button colorScheme="blue" onClick={handleAddCustomer}>Добавить клиента</Button>
        <Button colorScheme="teal" onClick={() => router.push('/admin')}>Назад</Button>
        <Button colorScheme="red" onClick={handleLogout}>Выйти</Button>
      </Flex>
      <Table variant="simple">
        <Thead>

          <Tr>
            <Th>ID</Th>
            <Th>UserID</Th>
            <Th>Имя</Th>
            <Th>Телефон</Th>
            <Th>Email</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {customers?.map((customer) => (
            <Tr key={customer.id}>
              <Td>{customer.id}</Td>
              <Td>{customer.user_id}</Td>
              <Td>{customer.name}</Td>
              <Td>{customer.phone}</Td>
              <Td>{customer.email}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<EditIcon />} onClick={() => openEditCustomerModal(customer)} />
                <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => handleDeleteCustomer(customer.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавление Клиента</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Имя пользователя</FormLabel>
              <Select
                value={newCustomer.user_id.toString()}
                onChange={(e) => setNewCustomer({ ...newCustomer, user_id: parseInt(e.target.value) })}
              >
                {users?.map((user) => (
                  <option key={user.id} value={user.id.toString()}>{user.login}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Имя</FormLabel>
              <Input
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Телефон</FormLabel>
              <Input
                type="number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: parseInt(e.target.value) })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateCustomer}>Добавить</Button>
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Редактирование клиента</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* Populate the input fields with the data of the customer being edited */}
      <FormControl>
        <FormLabel>Имя пользователя</FormLabel>
        <Select
          value={editingCustomer?.user_id.toString() || ''}
          onChange={(e) => {
            setEditingCustomer({
              ...editingCustomer!,
              user_id: parseInt(e.target.value),
            });
          }}
        >
          {users?.map((user) => (
            <option key={user.id} value={user.id.toString()}>
              {user.login}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Имя</FormLabel>
        <Input
          value={editingCustomer?.name || ''}
          onChange={(e) => {
            setEditingCustomer({
              ...editingCustomer!,
              name: e.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Телефон</FormLabel>
        <Input
          type="number"
          value={editingCustomer?.phone || ''}
          onChange={(e) => {
            setEditingCustomer({
              ...editingCustomer!,
              phone: parseInt(e.target.value),
            });
          }}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={editingCustomer?.email || ''}
          onChange={(e) => {
            setEditingCustomer({
              ...editingCustomer!,
              email: e.target.value,
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
  );
};

export default AdminCustomersPage;
