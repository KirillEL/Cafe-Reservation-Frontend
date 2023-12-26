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
import { useRouter } from 'next/navigation';

interface IReservations {
    id: number;
    customer_id: number;
    table_id: number;
    reserve_time: string;
    duration: number;
    status: string;
}

interface IAddReservation {
  customer_id: number;
  table_id: number;
  reserve_time: string;
  duration: number;
  status: string;
}

interface ITables {
  id: number;
  number: string;
  seats: number;
}

interface ICustomers {
  id: number;
  user_id: number;
  name: string;
  phone: number;
  email: string;
}


const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<IReservations[] | null>(null);
  const [tables, setTables] = useState<ITables[] | null>(null);
  const [customers, setCustomers] = useState<ICustomers[] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<IAddReservation | null>(null);
  const [editingReservationId, setEditingReservationId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newReservation, setNewReservation] = useState<IAddReservation>({
    customer_id: 0,
    table_id: 0,
    reserve_time: '',
    duration: 0,
    status: '',
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

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`${API_URL}/v1/table/all`, {withCredentials: true});
        if(response.status === 200 && response.data) {
            setTables(response.data.data);
        }
      } catch (error) {
        const e = error as AxiosError;
        if(e?.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };
    fetchTables();
}, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${API_URL}/v1/reservation/all`, {withCredentials: true});
        setReservations(response.data.data); 
      } catch (error) {
        const e = error as AxiosError;
        if (e?.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };
    fetchReservations();
  }, []);

  const handleAddReservation = () => {
    setNewReservation({
      customer_id: 0,
      table_id: 0,
      reserve_time: '',
      duration: 0,
      status: '',
    });
    onOpen();
  };

  const openEditReservationModal = (reservation: IReservations) => {
    setEditingReservation(reservation);
    setEditingReservationId(reservation.id);
    setIsEditModalOpen(true);
  };

  const handleEditReservation = (reservation: IAddReservation) => {
    setNewReservation(reservation);
    onOpen();
  };

  const handleDeleteReservation = async (reservationId: number) => {
    try {
    const response = await axios.delete(`${API_URL}/v1/reservation/delete/${reservationId}`,{withCredentials: true});
    if (response.status === 200) {
        window.location.reload();
    }
} catch (err) {
    alert(err);
}
  };

  const handleCreateReservation = async () => {
    try {
        const response = await axios.post(`${API_URL}/v1/reservation/admin/create`, newReservation, {
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

  const handleEditSaveReservation = async () => {
    try {
      if(editingReservation && editingReservationId) {
        const response = await axios.put(`${API_URL}/v1/reservation/update/${editingReservationId}`, editingReservation, {headers: {'Content-Type': 'application/json'}, withCredentials: true});
        if(response.status === 200) window.location.reload();
      }
    } catch (error) {
      alert(error);
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

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Button colorScheme="blue" onClick={handleAddReservation}>Добавить бронирование</Button>
        <Button colorScheme="teal" onClick={() => router.push('/admin')}>Назад</Button>
        <Button colorScheme="red" onClick={handleLogout}>Выйти</Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Клиент</Th>
            <Th>Стол</Th>
            <Th>Время брони</Th>
            <Th>Продолжительность</Th>
            <Th>Статус</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reservations?.map((reservation) => (
            <Tr key={reservation.id}>
              <Td>{reservation.id}</Td>
              <Td>{reservation.customer_id}</Td>
              <Td>{reservation.table_id}</Td>
              <Td>{reservation.reserve_time}</Td>
              <Td>{reservation.duration}</Td>
              <Td>{reservation.status}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<EditIcon />} onClick={() => openEditReservationModal(reservation)} />
                <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => handleDeleteReservation(reservation.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавление Бронирования</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Customer</FormLabel>
              <Select
                value={newReservation.customer_id}
                onChange={(e) => setNewReservation({ ...newReservation, customer_id: parseInt(e.target.value) })}
              >
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Table</FormLabel>
              <Select
                value={newReservation.table_id}
                onChange={(e) => setNewReservation({ ...newReservation, table_id: parseInt(e.target.value) })}
              >
                {tables?.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.number}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Время брони</FormLabel>
              <Input
                type="datetime-local"
                value={newReservation.reserve_time}
                onChange={(e) => setNewReservation({ ...newReservation, reserve_time: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Продолжительность</FormLabel>
              <Input
                type="number"
                value={newReservation.duration}
                onChange={(e) => setNewReservation({ ...newReservation, duration: parseInt(e.target.value) })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Статус</FormLabel>
              <Input
                value={newReservation.status}
                onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateReservation}>Добавить</Button>
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Редактирование бронирования</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* Populate the input fields with the data of the reservation being edited */}
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Select
          value={editingReservation?.customer_id.toString() || ''}
          onChange={(e) => {
            setEditingReservation({
              ...editingReservation!,
              customer_id: parseInt(e.target.value),
            });
          }}
        >
          {customers?.map((customer) => (
            <option key={customer.id} value={customer.id.toString()}>
              {customer.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Table</FormLabel>
        <Select
          value={editingReservation?.table_id.toString() || ''}
          onChange={(e) => {
            setEditingReservation({
              ...editingReservation!,
              table_id: parseInt(e.target.value),
            });
          }}
        >
          {tables?.map((table) => (
            <option key={table.id} value={table.id.toString()}>
              {table.number}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Время брони</FormLabel>
        <Input
          type="datetime-local"
          value={editingReservation?.reserve_time || ''}
          onChange={(e) => {
            setEditingReservation({
              ...editingReservation!,
              reserve_time: e.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Продолжительность</FormLabel>
        <Input
          type="number"
          value={editingReservation?.duration.toString() || ''}
          onChange={(e) => {
            setEditingReservation({
              ...editingReservation!,
              duration: parseInt(e.target.value),
            });
          }}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Статус</FormLabel>
        <Input
          value={editingReservation?.status || ''}
          onChange={(e) => {
            setEditingReservation({
              ...editingReservation!,
              status: e.target.value,
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
          handleEditSaveReservation();
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

export default AdminReservationsPage;
