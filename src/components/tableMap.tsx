'use client'
import { API_URL } from "@/utils/constants";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Input,
  Modal,
  useDisclosure,
  ModalFooter,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage, FieldAttributes } from "formik";

// Define interfaces for table and reservation details
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
  reserve_time: string;
  duration: string;
}

// Define validation schema using Yup
const reservationSchema = Yup.object().shape({
  reserve_time: Yup.date()
    .min(new Date(), "Дата не может быть прошедшей")
    .required("Дата обязательна для заполнения"),
    duration: Yup.string()
    .test('is-valid-time', 'Неверный формат времени', (value) => {
      if (!value) return true;
      const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      return timePattern.test(value);
    })
    .required('Длительность обязательна для заполнения'),
  name: Yup.string().required("Имя обязательно для заполнения"),
  phone: Yup.string()
    .matches(/^\d+$/, "Номер телефона должен содержать только цифры")
    .required("Номер телефона обязателен для заполнения"),
  email: Yup.string()
    .email("Неправильный формат адреса электронной почты")
    .required("Email обязателен для заполнения"),
});

const InteractiveTableMap: React.FC<{ tables: ITable[] | null }> = ({
  tables,
}: {
  tables: ITable[] | null;
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(
    {}
  );
  const [reservationDetails, setReservationDetails] =
    useState<IHandleReserveTable>({
      name: "",
      phone: "",
      email: "",
      table_number: "",
      reserve_time: "",
      duration: "",
    });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectTable = (tableNumber: string) => {
    setSelectedTable(tableNumber);
    setReservationDetails({ ...reservationDetails, table_number: tableNumber });
    onOpen();
  };

  return (
    <Flex
      wrap="nowrap"
      overflowX="auto"
      overflowY="hidden"
      position="relative"
      height="80vh"
      className="shadow-xl"
      bg="gray.150"
    >
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
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Table {table.number}
          </Text>
          <Text fontSize="md" color="gray.600">
            Seats: {table.seats}
          </Text>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reserve Table {selectedTable}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                reserve_time: "",
                duration: "",
                name: "",
                phone: "",
                email: "",
              }}
              validationSchema={reservationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const formattedReserveTime = new Date(
                    values.reserve_time
                  ).toISOString();
                  const dataToSend: IHandleReserveTable = {
                    ...values,
                    reserve_time: formattedReserveTime,
                    table_number: selectedTable || "",
                  };

                  const response = await axios.post(
                    `${API_URL}/v1/reservation/create`,
                    dataToSend,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                      withCredentials: true,
                    }
                  );
                  if (response.status === 200) {
                    window.location.reload();
                  }
                  onClose();
                } catch (error) {
                  if (error instanceof Yup.ValidationError) {
                    const errors: Record<string, string> = {};
                    error.inner.forEach((e) => {
                      if (e.path) {
                        errors[e.path] = e.message;
                      }
                    });
                    setValidationErrors(errors);
                  } else {
                    // Handle other errors
                  }
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="reserve_time">
                    {({ field, meta }: FieldAttributes<any>) => (
                      <FormControl isInvalid={meta.touched && !!meta.error}>
                        <FormLabel>Date</FormLabel>
                        <Input
                          {...field}
                          placeholder="Select date"
                          type="date"
                          isInvalid={!!validationErrors.reserve_time}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="duration">
                    {({ field, meta }: FieldAttributes<any>) => (
                      <FormControl mt={4} isInvalid={meta.touched && !!meta.error}>
                        <FormLabel>Time</FormLabel>
                        <Input
                          {...field}
                          placeholder="Select time"
                          type="time"
                          isInvalid={!!validationErrors.duration}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="name">
                    {({ field, meta }: FieldAttributes<any>) => (
                      <FormControl mt={4} isInvalid={meta.touched && !!meta.error}>
                        <FormLabel>Name</FormLabel>
                        <Input
                          {...field}
                          placeholder="Your name"
                          isInvalid={!!validationErrors.name}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                      
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field, meta }: FieldAttributes<any>) => (
                      <FormControl mt={4} isInvalid={meta.touched && !!meta.error}>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Your phone number"
                          isInvalid={!!validationErrors.phone}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, meta }: FieldAttributes<any>) => (
                      <FormControl mt={4} isInvalid={meta.touched && !!meta.error}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          {...field}
                          placeholder="Your email"
                          isInvalid={!!validationErrors.email}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={onClose}
                      isDisabled={isSubmitting}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="ghost"
                      isDisabled={isSubmitting}
                    >
                      Reserve
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default InteractiveTableMap;
