'use client'
import Header from "@/components/header";
import { API_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Divider, Badge, Button } from "@chakra-ui/react";

interface IReservations {
    reserve_time: string;
    duration: number;
    status: string;
    name: string;
    phone: number;
    email: string;
    id: number;
}

const MyReservationsPage: React.FC = () => {
    const [myReservations, setMyReservations] = useState<IReservations[] | null>(null);

    useEffect(() => {
        const fetchMyReservations = async () => {
            try {
                const response = await axios.get(`${API_URL}/v1/reservation/get/own`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                if (response.status === 200 && response.data) {
                    console.log(response.data);
                    setMyReservations(response.data.data);
                }
            } catch (error) {
                window.location.href='/';
            }
        };
        fetchMyReservations();
    }, []);

    const handleDeleteReservation = async (reservationId: number) => {
        try {
            const response = await axios.delete(`${API_URL}/v1/reservation/delete/${reservationId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                // Обновите состояние, чтобы отразить удаление
                setMyReservations(myReservations?.filter(reservation => reservation.id !== reservationId) || null);
            }
        } catch (error) {
            alert('Ошибка при удалении бронирования');
        }
    };

    return (
        <>
            <Header isAuth={true}/>
            <main className="container mx-auto p-5">
                <h2 className="text-center my-10 text-2xl font-bold text-gray-800">Мои бронирования</h2>
                <VStack divider={<Divider />} spacing={4} align="stretch">
                    {myReservations && myReservations.length > 0 ? (
                        myReservations.map((reservation) => (
                            <Box p={5} shadow="md" borderWidth="1px" key={reservation.id} className="rounded-xl shadow-xl">
                                <Flex justify="space-between" align="center">
                                    <VStack align="flex-start" flex="1">
                                        <Text fontSize="lg" fontWeight="bold">{reservation.name}</Text>
                                        <Text><span className="font-bold underline">Время:</span> {reservation.reserve_time}</Text>
                                        <Text><span className="font-bold underline">Продолжительность:</span> {reservation.duration} минут</Text>
                                        <Text><span className="font-bold underline">Телефон:</span> {reservation.phone}</Text>
                                        <Text><span className="font-bold underline">Email:</span> {reservation.email}</Text>
                                    </VStack>
                                    <Badge className="my-auto mx-3 w-5 py-3 border-2 text-center" flex="0.1" style={{borderRadius: '20px'}} colorScheme={reservation.status === 'active' ? 'green' : 'red'}>
                                        {reservation.status}
                                    </Badge>
                                    <Button colorScheme="red" onClick={() => handleDeleteReservation(reservation.id)}>
                                        Удалить
                                    </Button>
                                </Flex>
                            </Box>
                        ))
                    ) : (
                        <Text>У вас пока нет бронирований.</Text>
                    )}
                </VStack>
            </main>
        </>
    );
};

export default MyReservationsPage;
