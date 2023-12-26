'use client'
import { API_URL } from "@/utils/constants";
import { Box, Button, Flex, FormControl, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Input, Modal, useDisclosure, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

 

interface ITable {
    number: string;
    seats: number;
    is_available: boolean;
}

interface IHandleReserveTable {
    name: string;
    phone: string;
    email: string;
    table_number: string;
    reserve_time: string,
    duration: string;
}

interface IPosition {
    left: string;
    top: string;
}

type TNewPos = {
    x: number;
    y: number;
}

const InteractiveTableMap: React.FC<{tables: ITable[] | null}> = ({tables}: {tables: ITable[] | null}) => {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [reservationDetails, setReservationDetails] = useState<IHandleReserveTable>({
        name: '',
        phone: '',
        email: '',
        table_number: '',
        reserve_time: '',
        duration: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const selectTable = (tableNumber: string) => {
        setSelectedTable(tableNumber);
        setReservationDetails({...reservationDetails, table_number: tableNumber});
        onOpen();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReservationDetails({
            ...reservationDetails,
            [name]: value,
        });
    };

    const handleReserveTable = async () => {
        try {

            const formattedReserveTime = new Date(reservationDetails.reserve_time).toISOString();
        const dataToSend: IHandleReserveTable = {
            ...reservationDetails,
            reserve_time: formattedReserveTime,
        };
        
            
        const response = await axios.post(`${API_URL}/v1/reservation/create`, dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        if (response.status === 200) {
            window.location.reload();
        }
        onClose();
    } catch (error) {

    }
    }

    const randomPosition = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    
    

    return (
        <Flex wrap="nowrap" overflowX="auto" overflowY="hidden" position="relative" height="80vh" className="shadow-xl" bg="gray.150">
            {tables?.map((table, index) => (
                <Box
                    key={index}
                    p={4}
                    m={2}
                    width="150px"
                    height="90px"
                    bg={table.is_available ? "#D3BDA4" : "gray.300"}
                    cursor={table.is_available ? "pointer" : "not-allowed"}
                    opacity={table.is_available ? 1 : 0.7}
                    pointerEvents={table.is_available ? "auto" : "none"}
                    onClick={() => table.is_available && selectTable(table.number)}
                    className="rounded-lg shadow"
                >
                    <Text fontSize="xl" fontWeight="bold" color="gray.800">Table {table.number}</Text>
                    <Text fontSize="md" color="gray.600">Seats: {table.seats}</Text>
                </Box>
            ))}

<Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reserve Table {selectedTable}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input name="reserve_time" placeholder="Select date" type="date" onChange={handleInputChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Time</FormLabel>
                            <Input name="duration" placeholder="Select time" type="time" onChange={handleInputChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" placeholder="Your name" onChange={handleInputChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Phone</FormLabel>
                            <Input name="phone" type="text" placeholder="Your phone number" onChange={handleInputChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" placeholder="Your email" onChange={handleInputChange} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost" onClick={handleReserveTable}>Reserve</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default InteractiveTableMap;


