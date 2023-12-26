'use client'
import Header from '@/components/header';
import { API_URL } from '@/utils/constants';
import { Spinner } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion'; 
import { useInView } from 'react-intersection-observer'; 

export default function HomePage() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          withCredentials: true,
        });
        if (response.data.claims.role === 'admin') {
          router.push('/admin');
          return;
        }
        if (response.status !== 200) {
          router.push('/login');
          return;
        } else {
          setIsLoading(false);
          setIsAuth(true);
          return;
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          router.push('/login');
        }
      }
    };
    verifyUser();
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true, 
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
      controls.start('visible');
      }, 500);
    }
  }, [inView, controls]);

  if (isLoading) {
    return <Spinner size={'xl'} />;
  }

  return (
    <>
      <Header isAuth={isAuth} />
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
            Добро пожаловать в сервис бронирования столиков <br /> в кафе &ldquo;Чашка кофе&rdquo;
          </h1>
        </motion.div>
      </div>
    </>
  );
}
