import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export const useServerRequest = (url: string, options?: RequestInit) => {
  const session = useSession();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.data?.user?.token}`,
  };

  const { data, error, mutate } = useSWR(url, async (url) => {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

  return {
    data,
    error,
    mutate,
  };
};
