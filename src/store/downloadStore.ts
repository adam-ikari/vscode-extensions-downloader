import { create } from "zustand";
import { Extension } from "@/types";
import { persist } from "zustand/middleware";

interface DownloadStore {
  isDownloading: boolean;
  setIsDownloading: (isDownloading: boolean) => void;
  downloadList: Extension[];
  setDownloadList: (downloadList: Extension[]) => void;
}

const useDownloadStore = create<DownloadStore>()(
  persist(
    (set) => ({
      isDownloading: false,
      setIsDownloading: (isDownloading) => set({ isDownloading }),
      downloadList: [],
      setDownloadList: (downloadList) => set({ downloadList }),
    }),
    {
      name: "vscode-extensions-downloader-store", // 本地存储键名
      version: 1, // 版本号
    }
  )
);

export default useDownloadStore;
