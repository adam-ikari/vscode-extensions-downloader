import { create } from 'zustand';
import { Extension } from '@/types';

interface ExtensionStore {
  query: string;
  setQuery: (query: string) => void;
  extensions: Extension[];
  setExtensions: (extensions: Extension[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  os: string;
  setOs: (os: string) => void;
  cpu: string;
  setCpu: (cpu: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  downloadList: Extension[];
  setDownloadList: (downloadList: Extension[]) => void;
  searchExtensions: () => Promise<void>;
}

const useExtensionStore = create<ExtensionStore>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  extensions: [],
  setExtensions: (extensions) => set({ extensions }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  os: 'win32',
  setOs: (os) => set({ os }),
  cpu: 'x64',
  setCpu: (cpu) => set({ cpu }),
  sortBy: '0',
  setSortBy: (sortBy) => set({ sortBy }),
  downloadList: [],
  setDownloadList: (downloadList) => set({ downloadList }),
  searchExtensions: async () => {
    const { query, sortBy } = useExtensionStore.getState();
    set({ loading: true });
    try {
      const res = await fetch(`/api/search?query=${query}&sortBy=${sortBy}`);
      const data = (await res.json()) as { extensions?: Extension[] };
      set({ extensions: data.extensions || [] });
    } catch (error) {
      console.error('Search失败:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useExtensionStore;