'use client'
import React, { SetStateAction, useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { API_URL } from '@/utils/constants';



interface ITables {
    id: number;
    number: string;
    seats: number;
}

interface INewTable {
  number: string;
  seats: number;
}

const AdminTablesPage: React.FC = () => {
  const [tables, setTables] = useState<ITables[] | null>(null);
  const [newTable, setNewTable] = useState<INewTable>({
    number: '',
    seats: 0
  });
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTable, setSelectedTable] = useState<ITables | null>(null);
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
const [editedTable, setEditedTable] = useState<ITables | null>(null);
const [editedTableId, setEditedTableId] = useState<number | null>(null);
  const router = useRouter();

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


    const handleAddTable = () => {
      setIsNewTableModalOpen(true);
    };
  
    const handleCloseNewTableModal = () => {
      setIsNewTableModalOpen(false);
      setNewTable({
        number: '',
        seats: 0,
      });
    };

  const handleEditTable = (table: ITables) => {
    setSelectedTable(table);
    onOpen();
    // Логика для изменения существующего стола
  };

  const handleDeleteTable = async (tableId: number) => {
    try {
    const response = await axios.delete(`${API_URL}/v1/table/delete/${tableId}`, {
        withCredentials: true
    });
    if(response.status === 200) {
        window.location.reload();
    }
} catch (error) {
    alert(error);
}
  };

  const handleSaveNewTable = async () => {
    try {
      console.log(newTable);
      var data = {
        "number": newTable.number.toString(),
        "seats": newTable.seats.toString()
      }
    const response = await axios.post(`${API_URL}/v1/table/create`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    if(response.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    alert(error);
  }
  }

  const handleEditTableModalOpen = (table: ITables) => {
    setEditedTable(table);
    setEditedTableId(table.id);
    setIsEditTableModalOpen(true);
  };

  const handleEditTableModalClose = () => {
    setEditedTable(null);
    setEditedTableId(null);
    setIsEditTableModalOpen(false);
  };

  const handleSaveEditedTable = async () => {
    try {
      if (editedTable && editedTableId) {
        const data = {
          number: editedTable.number,
          seats: editedTable.seats,
        };
        const response = await axios.put(
          `${API_URL}/v1/table/update/${editedTableId}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          window.location.reload();
        }
      }
    } catch (error) {
      alert(error);
    }
    handleEditTableModalClose(); // Close the modal after saving
  };

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`${API_URL}/auth/logout`, {withCredentials: true});
      if(response.status === 200) window.location.href ='/login';
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Button colorScheme="blue" onClick={handleAddTable}>Добавить стол</Button>
        <Button colorScheme="teal" onClick={() => router.push('/admin')}>Назад</Button>
        <Button colorScheme="red" onClick={handleLogout}>Выйти</Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Номер</Th>
            <Th>Места</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tables?.map((table) => (
            <Tr key={table.id}>
              <Td>{table.id}</Td>
              <Td>{table.number}</Td>
              <Td>{table.seats}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<EditIcon />} onClick={() => handleEditTableModalOpen(table)} />
                <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => handleDeleteTable(table.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isNewTableModalOpen} onClose={handleCloseNewTableModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить новый стол</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Form for adding a new table */}
            <FormControl>
              <FormLabel>Номер стола</FormLabel>
              <Input
                placeholder="Введите номер стола"
                value={newTable.number}
                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Количество мест</FormLabel>
              <Input
                type="number"
                placeholder="Введите количество мест"
                value={newTable.seats}
                onChange={(e) => setNewTable({ ...newTable, seats: parseInt(e.target.value) })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveNewTable}>
              Сохранить
            </Button>
            <Button onClick={handleCloseNewTableModal}>Отменить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isEditTableModalOpen} onClose={handleEditTableModalClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Редактировать стол</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
      {/* Form for editing the table */}
      {editedTable && (
        <>
          <FormControl>
            <FormLabel>Номер стола</FormLabel>
            <Input
              placeholder="Введите номер стола"
              value={editedTable.number}
              onChange={(e) => setEditedTable({ ...editedTable, number: e.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Количество мест</FormLabel>
            <Input
              type="number"
              placeholder="Введите количество мест"
              value={editedTable.seats}
              onChange={(e) => setEditedTable({ ...editedTable, seats: parseInt(e.target.value) })}
            />
          </FormControl>
        </>
      )}
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handleSaveEditedTable}>
        Сохранить
      </Button>
      <Button onClick={handleEditTableModalClose}>Отменить</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>
  );
};

export default AdminTablesPage;
