import { create } from 'zustand';
import { Extension } from '@/types';
import useExtensionListStore from './downloadListStore';

interface ExtensionStore {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  platforms: string[];
  setPlatforms: (platforms: string[]) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchExtensions: () => Promise<void>;
}

const useExtensionStore = create<ExtensionStore>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  platforms: ['win32-x64'],
  setPlatforms: (platforms) => set({
    platforms: Array.isArray(platforms) ? platforms : [platforms]
  }),
  sortBy: '0',
  setSortBy: (sortBy) => set({ sortBy }),
  searchExtensions: async () => {
    const { query, sortBy } = useExtensionStore.getState();
    set({ loading: true });
    try {
      const res = await fetch(`/api/search?query=${query}&sortBy=${sortBy}`);
      const data = (await res.json()) as { extensions?: Extension[] };
      useExtensionListStore.getState().setExtensions(data.extensions || []);
    } catch (error) {
      console.error('Search失败:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useExtensionStore;