import { create } from 'zustand';
import { Extension } from '@/types';

interface DownloadListStore {
  extensions: Extension[];
  setExtensions: (extensions: Extension[]) => void;
  selectedExtensions: Extension[];
  setSelectedExtensions: (selectedExtensions: Extension[]) => void;
}

const useDownloadList = create<DownloadListStore>()((set) => ({
  extensions: [],
  setExtensions: (extensions) => set({ extensions }),
  selectedExtensions: [],
  setSelectedExtensions: (selectedExtensions) => set({ selectedExtensions }),
}));

export default useDownloadList;