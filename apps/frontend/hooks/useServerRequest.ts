import { signOut, useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Api } from '@devit-test-project/library';

const apiUrl = 'http://localhost:3002/api/';
export const useAuthorizedRequest: Api = (url, method, options) => {
  const endpointUrl = apiUrl + url;
  const session = useSession();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.data?.user?.token}`,
  };

  const { data, error, mutate } = useSWR(
    endpointUrl,
    async (endpointUrl) => {
      if (session.status !== 'authenticated') return null;
      const response = await fetch(endpointUrl, {
        ...options,
        headers,
        method,
      });
      if (!response.ok) {
        if (new Error(response.statusText).message === 'Unauthorized') {
          signOut();
        }
        throw new Error(response.statusText);
      }
      return response.json();
    },
    { refreshInterval: 10000, refreshWhenHidden: true }
  );
  console.log({
    data,
    error,
  });

  return {
    data,
    error,
    mutate,
  };
};
