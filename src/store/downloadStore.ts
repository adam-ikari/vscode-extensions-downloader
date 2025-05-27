import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Extension } from '@/types';

interface DownloadStore {
  isDownloading: boolean;
  setIsDownloading: (isDownloading: boolean) => void;
  downloadList: Extension[];
  setDownloadList: (downloadList: Extension[]) => void;
}

const useDownloadStore = create<DownloadStore>()((set) => ({
  isDownloading: false,
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  downloadList: [],
  setDownloadList: (downloadList) => set({ downloadList }),
}));

export default useDownloadStore;