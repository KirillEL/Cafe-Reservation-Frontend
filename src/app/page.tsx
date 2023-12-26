'use client'
import Header from '@/components/header'
import { API_URL } from '@/utils/constants'
import { Spinner } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


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
      if(response.data.claims.role === "admin") {
        router.push('/admin');
        return;
      }
      if(response.status !== 200) {
        router.push('/login');
        return;
      } else {
        setIsLoading(false);
        setIsAuth(true);
        return;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if(axiosError.response && axiosError.response.status === 401) {
        router.push('/login');
      }
      
    }
    }
    verifyUser();
  }, []);

  if(isLoading) {
    return <Spinner size={'xl'}/>
  }

  return (
    <>
      <Header isAuth={isAuth}/>
    </>
  )
}
