import JSZip from "jszip";
import { saveAs } from "file-saver";
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
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = `${ext.publisher.publisherName}.${ext.extensionName}-${ext.versions[0].version}.vsix`;
      folder?.file(fileName, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "vscode-extensions.zip");
  };

  return { downloadAndZipExtensions };
};