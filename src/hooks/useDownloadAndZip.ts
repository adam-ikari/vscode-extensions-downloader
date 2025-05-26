import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import { Extension } from "@/types";
import { useDownloadUrl } from "./useDownloadUrl";

export const useDownloadAndZip = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { getDownloadUrl } = useDownloadUrl();

  const downloadAndZipExtensions = async (
    extensions: Extension[],
    platforms: string[]
  ) => {
    setIsDownloading(true);
    const zip = new JSZip();
    const folder = zip.folder("vscode-extensions");
    
    for (const ext of extensions) {
      for (const platform of platforms) {
        const [os, cpu] = platform.split('-');
        const url = getDownloadUrl(ext, os, cpu);
        const response = await axios.get(url, {
          responseType: "blob"
        });
        
        // 从Content-Disposition获取文件名并添加平台信息
        let fileName = `${ext.publisher.publisherName}.${ext.extensionName}_${ext.versions[0].version}_${platform}.vsix`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }
      
      folder?.file(fileName, response.data);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "vscode-extensions.zip");
    setIsDownloading(false);
  };

  return { downloadAndZipExtensions, isDownloading };
};