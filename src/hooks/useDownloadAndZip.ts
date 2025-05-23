import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import { Extension } from "@/types";
import { useDownloadUrl } from "./useDownloadUrl";

export const useDownloadAndZip = () => {
  const { getDownloadUrl } = useDownloadUrl();

  const downloadAndZipExtensions = async (
    extensions: Extension[],
    os: string,
    cpu: string
  ) => {
    const zip = new JSZip();
    const folder = zip.folder("vscode-extensions");
    
    for (const ext of extensions) {
      const url = getDownloadUrl(ext, os, cpu);
      const response = await axios.get(url, {
        responseType: "blob"
      });
      
      // 从Content-Disposition获取文件名
      let fileName = `${ext.publisher.publisherName}.${ext.extensionName}-${ext.versions[0].version}.vsix`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }
      
      folder?.file(fileName, response.data);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "vscode-extensions.zip");
  };

  return { downloadAndZipExtensions };
};