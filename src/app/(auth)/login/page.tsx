'use client'
import React from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Container, Link} from '@chakra-ui/react';
import {useRouter} from "next/navigation";
import axios from 'axios';
import { API_URL } from '@/utils/constants';

// Схема валидации с помощью Yup
const validationSchema = Yup.object({
    email: Yup.string().email('Неверный адрес электронной почты').required('Обязательное поле'),
    password: Yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Обязательное поле'),
});

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {

    const router = useRouter();

    const handleLogin = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            
            if (response.status === 200) {
                router.push('/');
                return;
            }
            actions.setSubmitting(false);
        } catch (err) {
            actions.setSubmitting(false);
        }
    }

    return (
        <Container>
            <h1 className={"text-center font-medium text-2xl"}>Вход</h1>
            <Box p={6} borderRadius="md" w="full" maxW="lg">
                <Formik
                    initialValues={{email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {(props) => (
                        <Form>
                            <FormControl isInvalid={props.touched.email && !!props.errors.email} mb={4}>
                                <FormLabel htmlFor="email">Электронная почта</FormLabel>
                                <Field as={Input} id="email" name="email" type="email" variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="email"/></FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={props.touched.password && !!props.errors.password} mb={6}>
                                <FormLabel htmlFor="password">Пароль</FormLabel>
                                <Field as={Input} id="password" name="password" type="password" variant="filled" style={{backgroundColor: 'transparent', borderColor: '#8B4513'}}/>
                                <FormErrorMessage><ErrorMessage name="password"/></FormErrorMessage>
                            </FormControl>

                            <Button
                                mt={4}
                                isLoading={props.isSubmitting}
                                type="submit"
                                w="full"
                                style={{backgroundColor: '#8B4513'}} 
                                color="white" 
                                _hover={{backgroundColor: '#975e43'}}  
                            >
                                Вход
                            </Button>
                        </Form>
                    )}
                </Formik>
                Нет аккаунта? Тогда <Link onClick={()=>router.push('/register')} color={"#8B4513"} fontWeight={700}>Зарегистрируйтесь</Link>
            </Box>
        </Container>
    );
};

export default LoginPage;
