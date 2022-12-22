import create from 'zustand';
import { persist } from 'zustand/middleware';
import { ArticleType } from '@devit-test-project/library';
import { ISearchResult } from './search-bar';

interface ISearchResultStore {
  status: ISearchResult;
  prevLoadedPosts: ArticleType[];
  setStatus: (status: ISearchResult) => void;
  setPrevLoadedPosts: (prevLoadedPosts: ArticleType[]) => void;
}

export const useFoundPostsStore = create<ISearchResultStore>()(
  persist(
    (set, get) => ({
      status: {
        posts: [],
        loading: false,
        error: null,
        searchAuthor: '',
        searchTitle: '',
      },
      prevLoadedPosts: [],
      setStatus: (status: ISearchResult) => set({ status }),
      setPrevLoadedPosts: (prevLoadedPosts: ArticleType[]) =>
        set({ prevLoadedPosts }),
    }),
    {
      name: 'search-result', // unique name
    }
  )
);
