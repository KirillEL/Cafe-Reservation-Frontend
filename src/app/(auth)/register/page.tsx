'use client'
import React from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Container} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useRouter } from 'next/navigation';

// Схема валидации с помощью Yup
const validationSchema = Yup.object({
    login: Yup.string().required('Обязательное поле'),
    email: Yup.string().email('Неверный адрес электронной почты').required('Обязательное поле'),
    password: Yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Обязательное поле'),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Пароли должны совпадать')
        .required('Необходимо подтвердить пароль'),
});

interface RegisterFormValues {
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
}

const RegistrationPage: React.FC = () => {

    const router = useRouter()

    const handleRegister = async (values: RegisterFormValues, actions: FormikHelpers<RegisterFormValues>) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                router.push('/login');
            }
            actions.setSubmitting(false);
        } catch (err) {
            actions.setSubmitting(false);
        }
    }


    return (
        <Container>
            <h1 className={"text-center font-medium text-2xl"}>Регистрация</h1>
            <Box p={6} borderRadius="md" w="full" maxW="lg">
                <Formik
                    initialValues={{login: '', email: '', password: '', repeatPassword: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
                >
                    {(props) => (
                        <Form>
                            <FormControl isInvalid={props.touched.login && !!props.errors.login} mb={4}>
                                <FormLabel htmlFor="login">Логин</FormLabel>
                                <Field as={Input} id="login" name="login" type="text" variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="login"/></FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={props.touched.email && !!props.errors.email} mb={4}>
                                <FormLabel htmlFor="email">Электронная почта</FormLabel>
                                <Field as={Input} id="email" name="email" type="email" variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="email"/></FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={props.touched.password && !!props.errors.password} mb={4}>
                                <FormLabel htmlFor="password">Пароль</FormLabel>
                                <Field as={Input} id="password" name="password" type="password" variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="password"/></FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={props.touched.repeatPassword && !!props.errors.repeatPassword}
                                         mb={6}>
                                <FormLabel htmlFor="repeatPassword">Повторите пароль</FormLabel>
                                <Field as={Input} id="repeatPassword" name="repeatPassword" type="password"
                                       variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="repeatPassword"/></FormErrorMessage>
                            </FormControl>

                            <Button
                                mt={4}
                                isLoading={props.isSubmitting}
                                type="submit"
                                w="full"
                                style={{backgroundColor: '#8B4513'}}
                                color="white"
                                _hover={{backgroundColor: '#A0522D'}}
                            >
                                Регистрация
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default RegistrationPage;
