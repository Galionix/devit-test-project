import create from 'zustand';
import { persist } from 'zustand/middleware';

interface IIndexPageProps {
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
}

export const useIndexPageStore = create<IIndexPageProps>()(
  persist(
    (set, get) => ({
      scrollPosition: 0,
      setScrollPosition(scrollPosition) {
        set({ scrollPosition });
      },
    }),
    {
      name: 'index-page', // unique name
    }
  )
);
