import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Extension } from '@/types';

interface DownloadStore {
  downloadList: Extension[];
  setDownloadList: (downloadList: Extension[]) => void;
  isDownloading: boolean;
  setIsDownloading: (isDownloading: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  totalFiles: number;
  setTotalFiles: (totalFiles: number) => void;
  completedFiles: number;
  setCompletedFiles: (completedFiles: number) => void;
}

const STORAGE_KEY = 'vscode-extensions-downloader';

const useDownloadStore = create<DownloadStore>()(
  persist(
    (set) => ({
      downloadList: [],
      setDownloadList: (downloadList) => set({ downloadList }),
      isDownloading: false,
      setIsDownloading: (isDownloading) => set({ isDownloading }),
      progress: 0,
      setProgress: (progress) => set({ progress }),
      totalFiles: 0,
      setTotalFiles: (totalFiles) => set({ totalFiles }),
      completedFiles: 0,
      setCompletedFiles: (completedFiles) => set({ completedFiles }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ downloadList: state.downloadList }),
    }
  )
);

export default useDownloadStore;