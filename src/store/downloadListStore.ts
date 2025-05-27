import { create } from 'zustand';

export interface DownloadableExtension {
  extensionId: string;
  publisherName: string;
  extensionName: string;
  version: string;
}

interface DownloadListStore {
  extensions: DownloadableExtension[];
  setExtensions: (extensions: DownloadableExtension[]) => void;
  selectedExtensions: DownloadableExtension[];
  setSelectedExtensions: (selectedExtensions: DownloadableExtension[]) => void;
}

const useDownloadList = create<DownloadListStore>()((set) => ({
  extensions: [],
  setExtensions: (extensions) => set({ extensions }),
  selectedExtensions: [],
  setSelectedExtensions: (selectedExtensions) => set({ selectedExtensions }),
}));

export default useDownloadList;