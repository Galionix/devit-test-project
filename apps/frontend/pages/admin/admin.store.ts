import create from 'zustand';
import { persist } from 'zustand/middleware';

interface IAdminStoreProps {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
}

export const useAdminStoreStore = create<IAdminStoreProps>()(
  persist(
    (set, get) => ({
      accessToken: '',
      setAccessToken(accessToken) {
        set({ accessToken });
      },
    }),
    {
      name: 'admin-store', // unique name
    }
  )
);
